import Database from 'better-sqlite3';
import path from 'path';
import type { Session, Message, SessionStats, ToolUsage, SearchHit } from './types';

const DB_PATH = path.join(process.env.HOME || '/home/lucid', '.hermes/state.db');

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export function getSessions(limit = 50, offset = 0): Session[] {
  const stmt = getDb().prepare(`
    SELECT * FROM sessions
    ORDER BY started_at DESC
    LIMIT ? OFFSET ?
  `);
  return stmt.all(limit, offset) as Session[];
}

export function getSessionById(id: string): Session | null {
  const stmt = getDb().prepare('SELECT * FROM sessions WHERE id = ?');
  return (stmt.get(id) as Session) || null;
}

export function getMessagesBySession(sessionId: string): Message[] {
  const stmt = getDb().prepare(`
    SELECT * FROM messages
    WHERE session_id = ?
    ORDER BY timestamp ASC
  `);
  return stmt.all(sessionId) as Message[];
}

export function getSessionStats(): SessionStats {
  const database = getDb();

  const total = database.prepare('SELECT COUNT(*) as count FROM sessions').get() as { count: number };
  const msgTotal = database.prepare('SELECT COUNT(*) as count FROM messages').get() as { count: number };
  const toolTotal = database.prepare('SELECT SUM(tool_call_count) as total FROM sessions').get() as { total: number | null };
  const tokensIn = database.prepare('SELECT SUM(input_tokens) as total FROM sessions').get() as { total: number | null };
  const tokensOut = database.prepare('SELECT SUM(output_tokens) as total FROM sessions').get() as { total: number | null };
  const costTotal = database.prepare('SELECT SUM(actual_cost_usd) as total FROM sessions').get() as { total: number | null };

  // Sessions/messages today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayTs = todayStart.getTime() / 1000;

  const sessionsToday = database.prepare('SELECT COUNT(*) as count FROM sessions WHERE started_at >= ?').get(todayTs) as { count: number };
  const messagesToday = database.prepare('SELECT COUNT(*) as count FROM messages WHERE timestamp >= ?').get(todayTs) as { count: number };

  return {
    total_sessions: total.count,
    total_messages: msgTotal.count,
    total_tool_calls: toolTotal.total || 0,
    total_input_tokens: tokensIn.total || 0,
    total_output_tokens: tokensOut.total || 0,
    total_cost_usd: costTotal.total,
    sessions_today: sessionsToday.count,
    messages_today: messagesToday.count,
    avg_messages_per_session: total.count > 0 ? Math.round(msgTotal.count / total.count) : 0,
  };
}

export function getToolUsage(): ToolUsage[] {
  const database = getDb();

  // Tool names are stored inside tool_calls JSON as function.name
  // Parse them and aggregate
  interface RawToolRow {
    tool_calls: string;
    timestamp: number;
  }
  const rows = database.prepare(`
    SELECT tool_calls, timestamp FROM messages
    WHERE tool_calls IS NOT NULL
  `).all() as RawToolRow[];

  const toolMap = new Map<string, { count: number; last: number }>();

  for (const row of rows) {
    try {
      const calls = JSON.parse(row.tool_calls);
      const items = Array.isArray(calls) ? calls : [calls];
      for (const call of items) {
        // Handle both old and new format
        const name = call.function?.name || call.name;
        if (!name) continue;
        const existing = toolMap.get(name);
        if (existing) {
          existing.count++;
          if (row.timestamp > existing.last) existing.last = row.timestamp;
        } else {
          toolMap.set(name, { count: 1, last: row.timestamp });
        }
      }
    } catch {
      // Skip malformed JSON
    }
  }

  return Array.from(toolMap.entries())
    .map(([tool_name, data]) => ({
      tool_name,
      call_count: data.count,
      last_used: data.last,
    }))
    .sort((a, b) => b.call_count - a.call_count);
}

export function searchMessages(query: string, limit = 50): Message[] {
  const database = getDb();

  // Use FTS5 for search
  const stmt = database.prepare(`
    SELECT m.* FROM messages m
    JOIN messages_fts fts ON m.id = fts.rowid
    WHERE messages_fts MATCH ?
    ORDER BY m.timestamp DESC
    LIMIT ?
  `);

  try {
    return stmt.all(query, limit) as Message[];
  } catch {
    // Fallback to LIKE search if FTS fails
    const fallback = database.prepare(`
      SELECT * FROM messages
      WHERE content LIKE ?
      ORDER BY timestamp DESC
      LIMIT ?
    `);
    return fallback.all(`%${query}%`, limit) as Message[];
  }
}

export function getRecentSessions(limit = 10): Session[] {
  const stmt = getDb().prepare(`
    SELECT * FROM sessions
    ORDER BY started_at DESC
    LIMIT ?
  `);
  return stmt.all(limit) as Session[];
}

export function getSessionsByDate(date: string): Session[] {
  // date format YYYY-MM-DD
  const startOfDay = new Date(date + 'T00:00:00.000Z').getTime() / 1000;
  const endOfDay = startOfDay + 86400;

  const stmt = getDb().prepare(`
    SELECT * FROM sessions
    WHERE started_at >= ? AND started_at < ?
    ORDER BY started_at DESC
  `);
  return stmt.all(startOfDay, endOfDay) as Session[];
}

export function getTopTools(limit = 8): {name: string; calls: number}[] {
  const stmt = getDb().prepare(`
    SELECT tool_name, COUNT(*) as call_count 
    FROM messages 
    WHERE tool_name IS NOT NULL 
    GROUP BY tool_name 
    ORDER BY call_count DESC 
    LIMIT ?
  `);
  return stmt.all(limit).map((t: any) => ({ name: t.tool_name, calls: t.call_count }));
}

export function getSessionsDaily(days = 30): {date: string; sessions: number}[] {
  const stmt = getDb().prepare(`
    SELECT 
      strftime('%Y-%m-%d', datetime(started_at / 1000, 'unixepoch')) as date,
      COUNT(*) as sessions 
    FROM sessions 
    WHERE started_at >= (strftime('%s', 'now', '-? days') * 1000)
    GROUP BY date 
    ORDER BY date ASC
  `);
  return stmt.all(days).map((r: any) => ({ date: r.date, sessions: r.sessions }));
}

export function searchGlobal(query: string, limit = 50): SearchHit[] {
  const db = getDb();
  const results: SearchHit[] = [];

  // Messages FTS
  let msgStmt;
  try {
    msgStmt = db.prepare(`
      SELECT m.*, rank AS score FROM messages_fts fts
      JOIN messages m ON m.id = fts.rowid
      WHERE messages_fts MATCH ?
      ORDER BY rank
      LIMIT ?
    `);
    const msgs = msgStmt.all(query + '*', Math.floor(limit / 3)) as (Message & {score: number})[];
    for (const m of msgs) {
      results.push({
        type: 'message' as const,
        id: m.id.toString(),
        preview: m.content?.slice(0, 100) || '',
        snippet: m.content?.slice(0, 200) || '',
        session_id: m.session_id,
        timestamp: m.timestamp,
        score: m.score,
      });
    }
  } catch {}

  // Sessions LIKE title/source
  const sesStmt = db.prepare(`
    SELECT *, 0 as score FROM sessions
    WHERE title LIKE ? OR source LIKE ?
    ORDER BY started_at DESC
    LIMIT ?
  `);
  const sessions = sesStmt.all(`%${query}%`, `%${query}%`, Math.floor(limit / 3)) as (Session & {score: number})[];
  for (const s of sessions) {
    results.push({
      type: 'session' as const,
      id: s.id,
      preview: s.title || s.source || 'Session',
      snippet: s.title || undefined,
      session_id: s.id,
      timestamp: s.started_at,
      score: s.score,
    });
  }

  // Tool calls LIKE in tool_calls
  const toolStmt = db.prepare(`
    SELECT *, 0 as score FROM messages
    WHERE tool_calls LIKE ?
    ORDER BY timestamp DESC
    LIMIT ?
  `);
  const tools = toolStmt.all(`%${query}%`, Math.floor(limit / 3)) as (Message & {score: number})[];
  for (const t of tools) {
    results.push({
      type: 'tool_call' as const,
      id: t.tool_call_id || t.id.toString(),
      preview: t.tool_name || 'Tool call',
      snippet: t.tool_calls?.slice(0, 200) || '',
      session_id: t.session_id,
      timestamp: t.timestamp,
      score: t.score,
    });
  }

  // Sort by score desc, then timestamp desc, limit
  results.sort((a, b) => (b.score || 0) - (a.score || 0) || b.timestamp - a.timestamp);
  return results.slice(0, limit);
}
