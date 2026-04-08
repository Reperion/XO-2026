'use client';

import { useEffect, useState } from 'react';
import type { ToolUsage } from '@/lib/types';

function timeAgo(ts: number): string {
  const seconds = Math.floor(Date.now() / 1000 - ts);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function ToolsPage() {
  const [tools, setTools] = useState<ToolUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/tools');
        const data = await res.json();
        setTools(data.tools || []);
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  const maxCalls = tools.length > 0 ? Math.max(...tools.map(t => t.call_count)) : 1;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Tool Usage</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
          Which tools Hermes uses most, based on message records
        </p>
      </div>

      {loading ? (
        <div style={{ color: 'var(--muted)' }}>Loading tool data...</div>
      ) : tools.length === 0 ? (
        <div style={{ color: 'var(--muted)' }}>No tool usage data yet</div>
      ) : (
        <div>
          {tools.map((tool) => {
            const barWidth = (tool.call_count / maxCalls) * 100;
            return (
              <div
                key={tool.tool_name}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  marginBottom: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    {tool.tool_name}
                  </span>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                      last used {timeAgo(tool.last_used)}
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--accent)' }}>
                      {tool.call_count}
                    </span>
                  </div>
                </div>
                {/* Bar */}
                <div style={{ background: 'var(--border)', borderRadius: '9999px', height: '6px', overflow: 'hidden' }}>
                  <div
                    style={{
                      background: 'var(--accent)',
                      height: '100%',
                      width: `${barWidth}%`,
                      borderRadius: '9999px',
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
