// Hermes Dashboard — Database Wrapper
import Database from 'better-sqlite3';
import path from 'path';
import type { Session, Message, SessionStats, ToolUsage } from './types';

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
  // date format: YYYY-MM-DD
  const startOfDay = new Date(date + 'T00:00:00.000Z').getTime() / 1000;
  const endOfDay = startOfDay + 86400;

  const stmt = getDb().prepare(`
    SELECT * FROM sessions
    WHERE started_at >= ? AND started_at < ?
    ORDER BY started_at DESC
  `);
  return stmt.all(startOfDay, endOfDay) as Session[];
}
