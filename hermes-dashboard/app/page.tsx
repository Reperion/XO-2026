'use client';

import { useEffect, useState } from 'react';
import type { Session, SessionStats } from '@/lib/types';

function formatNumber(n: number | null): string {
  if (n === null || n === 0) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

function formatCost(n: number | null): string {
  if (n === null) return '—';
  return '$' + n.toFixed(4);
}

function timeAgo(ts: number): string {
  const seconds = Math.floor(Date.now() / 1000 - ts);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [recent, setRecent] = useState<Session[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, sessionsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/sessions?limit=10'),
        ]);
        if (!statsRes.ok || !sessionsRes.ok) throw new Error('API error');
        const statsData = await statsRes.json();
        const sessionsData = await sessionsRes.json();
        setStats(statsData);
        setRecent(sessionsData.sessions);
      } catch (e) {
        setError('Failed to load dashboard data');
      }
    }
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div style={{ color: 'var(--error)' }}>{error}</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
        Hermes Overview
      </h1>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Total Sessions" value={formatNumber(stats?.total_sessions ?? 0)} />
        <StatCard label="Total Messages" value={formatNumber(stats?.total_messages ?? 0)} />
        <StatCard label="Total Tool Calls" value={formatNumber(stats?.total_tool_calls ?? 0)} />
        <StatCard label="Input Tokens" value={formatNumber(stats?.total_input_tokens ?? 0)} />
        <StatCard label="Output Tokens" value={formatNumber(stats?.total_output_tokens ?? 0)} />
        <StatCard label="Est. Cost" value={formatCost(stats?.total_cost_usd ?? null)} />
        <StatCard label="Sessions Today" value={formatNumber(stats?.sessions_today ?? 0)} />
        <StatCard label="Msgs Today" value={formatNumber(stats?.messages_today ?? 0)} />
      </div>

      {/* Recent sessions */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Recent Sessions</h2>
          <a href="/sessions" style={{ fontSize: '0.875rem' }}>View all →</a>
        </div>

        {recent.length === 0 ? (
          <div style={{ color: 'var(--muted)' }}>No sessions yet</div>
        ) : (
          <div>
            {recent.map((session) => (
              <a
                key={session.id}
                href={`/sessions/${session.id}`}
                className="session-row"
                style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                      {session.title || session.id}
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      {session.source} · {session.model?.split('/')[1] || session.model || 'unknown'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="time-ago">{timeAgo(session.started_at)}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      {session.message_count} msgs · {session.tool_call_count} tools
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
