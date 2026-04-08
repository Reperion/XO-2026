'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatCard from '@/components/ui/StatCard';
import SessionRow from '@/components/ui/SessionRow';
import type { Session, SessionStats } from '@/lib/types';
import { formatNumber, formatCost } from '@/lib/utils';

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
      } catch {
        setError('Failed to load dashboard data');
      }
    }
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div className="text-[var(--error)]">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Hermes Overview</h1>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 mb-8">
        <StatCard label="Total Sessions" value={formatNumber(stats?.total_sessions ?? 0)} />
        <StatCard label="Total Messages" value={formatNumber(stats?.total_messages ?? 0)} />
        <StatCard label="Total Tool Calls" value={formatNumber(stats?.total_tool_calls ?? 0)} />
        <StatCard label="Input Tokens" value={formatNumber(stats?.total_input_tokens ?? 0)} />
        <StatCard label="Output Tokens" value={formatNumber(stats?.total_output_tokens ?? 0)} />
        <StatCard label="Est. Cost" value={formatCost(stats?.total_cost_usd ?? null)} />
        <StatCard label="Sessions Today" value={formatNumber(stats?.sessions_today ?? 0)} />
        <StatCard label="Msgs Today" value={formatNumber(stats?.messages_today ?? 0)} />
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Sessions</h2>
          <Link href="/sessions" className="text-sm hover:text-accent-hover">View all →</Link>
        </div>

        {recent.length === 0 ? (
          <div className="text-muted-foreground">No sessions yet</div>
        ) : (
          recent.map((session) => (
            <SessionRow key={session.id} session={session} />
          ))
        )}
      </div>
    </div>
  );
}