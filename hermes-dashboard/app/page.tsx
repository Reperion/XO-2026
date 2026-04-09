'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import StatCard from '@/components/ui/StatCard';
import SessionRow from '@/components/ui/SessionRow';
import ChartsGrid from '@/components/charts/ChartsGrid';
import type { Session, SessionStats, SearchHit } from '@/lib/types';
import type { FC } from 'react';
import { formatNumber, formatCost } from '@/lib/utils';

interface ToolData {
  name: string;
  calls: number;
}

interface DailyData {
  date: string;
  sessions: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [toolData, setToolData] = useState<ToolData[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [recent, setRecent] = useState<Session[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchHit[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, toolsRes, dailyRes, sessionsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/tools'),
          fetch('/api/sessions-daily'),
          fetch('/api/sessions?limit=10'),
        ]);
        if (!statsRes.ok || !toolsRes.ok || !dailyRes.ok || !sessionsRes.ok) throw new Error('API error');
        const statsData = await statsRes.json();
        const toolData_ = await toolsRes.json();
        const dailyData_ = await dailyRes.json();
        const sessionsData = await sessionsRes.json();
        setStats(statsData);
        setToolData((toolData_.tools || toolData_).map((t: any) => ({ name: t.tool_name || t.name, calls: t.call_count || t.calls })));
        setDailyData(dailyData_);
        setRecent(sessionsData.sessions);
      } catch {
        setError('Failed to load dashboard data');
      }
    }
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => handleSearch(searchQuery), 300);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchQuery, handleSearch]);

  if (error) {
    return <div className="text-[var(--error)]">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Hermes Overview</h1>

      <div className="mb-8 relative md:max-w-2xl">
        <input
          type="search"
          placeholder="Search messages, sessions, tools, jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
        />
        {searchQuery && (
          <button
            onClick={() => { setSearchQuery(''); setSearchResults([]); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm px-2 py-1 rounded"
            style={{ color: 'var(--muted)' }}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {searchResults.length > 0 && (
        <div className="mb-8 space-y-2 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm" style={{ color: 'var(--muted)' }}>{searchResults.length} results</span>
            <button
              onClick={() => { setSearchQuery(''); setSearchResults([]); }}
              className="text-xs px-3 py-1 rounded"
              style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              Clear results
            </button>
          </div>
          {searchResults.map((hit, idx) => (
            <details key={idx} className="rounded-lg overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <summary className="p-4 cursor-pointer list-none font-medium flex items-center" style={{ background: 'var(--card)' }}>
                <span className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${hit.type === 'message' ? 'bg-blue-500' : hit.type === 'session' ? 'bg-green-500' : 'bg-purple-500'}`} />
                <span style={{ color: 'var(--foreground)' }}>{hit.preview}</span>
                <span className="ml-auto text-xs" style={{ color: 'var(--muted)' }}>{new Date(hit.timestamp * 1000).toLocaleDateString()}</span>
              </summary>
              <div className="p-4 pt-0 text-sm" style={{ background: 'var(--card-hover)', color: 'var(--foreground)' }}>
                {hit.snippet && hit.snippet !== hit.preview && <p style={{ color: 'var(--muted)' }}>{hit.snippet}</p>}
                <Link
                  href={`/sessions/${hit.session_id}`}
                  className="hover:underline text-xs mt-2 inline-block"
                  style={{ color: 'var(--accent)' }}
                >
                  View in session →
                </Link>
              </div>
            </details>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 mb-8">
        <StatCard label="Total Sessions" value={formatNumber(stats?.total_sessions ?? 0)} />
        <StatCard label="Total Messages" value={formatNumber(stats?.total_messages ?? 0)} />
        <StatCard label="Total Tool Calls" value={formatNumber(stats?.total_tool_calls ?? 0)} />
        <StatCard label="Input Tokens" value={formatNumber(stats?.total_input_tokens ?? 0)} />
        <StatCard label="Output Tokens" value={formatNumber(stats?.total_output_tokens ?? 0)} />
        <StatCard label="Est. Cost" value={formatCost(stats?.total_cost_usd ?? null)} />
        <StatCard label="Sessions Today" value={formatNumber(stats?.sessions_today ?? 0)} />
        <StatCard label="Msgs Today" value={formatNumber(stats?.messages_today ?? 0)} />
      </div>

      {stats && (
        <ChartsGrid 
          stats={stats} 
          toolData={toolData} 
          dailyData={dailyData} 
        />
      )}

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