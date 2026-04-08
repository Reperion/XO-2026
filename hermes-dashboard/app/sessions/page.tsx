'use client';

import { useEffect, useState } from 'react';
import type { Session } from '@/lib/types';

function timeAgo(ts: number): string {
  const seconds = Math.floor(Date.now() / 1000 - ts);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleString();
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/sessions?limit=100');
        const data = await res.json();
        setSessions(data.sessions);
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const filtered = sessions.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.id.toLowerCase().includes(q) ||
      s.title?.toLowerCase().includes(q) ||
      s.source.toLowerCase().includes(q) ||
      s.model?.toLowerCase().includes(q) ||
      ''
    );
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Sessions</h1>
        <span style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
          {sessions.length} total
        </span>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search sessions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            color: 'var(--foreground)',
            width: '100%',
            maxWidth: '400px',
          }}
        />
      </div>

      {loading ? (
        <div style={{ color: 'var(--muted)' }}>Loading sessions...</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: 'var(--muted)' }}>No sessions found</div>
      ) : (
        <div>
          {filtered.map((session) => (
            <a
              key={session.id}
              href={`/sessions/${session.id}`}
              className="session-row"
              style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    {session.title || <span style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: '0.8rem' }}>{session.id}</span>}
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
                    {formatDate(session.started_at)} · {session.source} · {session.model?.split('/')[1] || session.model}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div className="time-ago">{timeAgo(session.started_at)}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', justifyContent: 'flex-end' }}>
                    <span className="tool-badge">{session.message_count} msgs</span>
                    {session.tool_call_count > 0 && (
                      <span className="tool-badge" style={{ background: 'var(--success)' }}>
                        {session.tool_call_count} tools
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
