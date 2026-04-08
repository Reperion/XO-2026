'use client';

import { useEffect, useState } from 'react';
import type { CronJob } from '@/lib/types';

function formatNext(ts: string | null): string {
  if (!ts) return '—';
  const d = new Date(ts);
  return d.toLocaleString();
}

function JobStatus({ enabled, lastStatus }: { enabled: boolean; lastStatus: string | null }) {
  if (!enabled) return <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>paused</span>;
  if (lastStatus === 'success') return <span style={{ color: 'var(--success)', fontSize: '0.8rem' }}>✓ ok</span>;
  if (lastStatus === 'error') return <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>✗ error</span>;
  return <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>—</span>;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/jobs');
        if (!res.ok) throw new Error('Hermes API not reachable');
        const data = await res.json();
        setJobs(data.jobs || []);
        setError(null);
      } catch (e) {
        setError('Cannot connect to Hermes API. Is the gateway running?');
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{ color: 'var(--muted)' }}>Loading jobs...</div>;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Cron Jobs</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
          Hermes cron jobs — autonomous tasks that wake XO throughout the day
        </p>
      </div>

      {error ? (
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--error)',
          borderRadius: '0.5rem',
          padding: '1rem',
          color: 'var(--error)',
        }}>
          {error}
          <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--muted)' }}>
            The Hermes API server runs at 127.0.0.1:8642. Start it with: python -m hermes_agent.gateway.run
          </div>
        </div>
      ) : jobs.length === 0 ? (
        <div style={{ color: 'var(--muted)' }}>No cron jobs configured</div>
      ) : (
        <div>
          {jobs.map((job) => (
            <div
              key={job.job_id}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{job.name}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                    {job.schedule} · {job.repeat ? `${job.repeat}x` : '∞'} · ID: {job.job_id}
                  </div>
                </div>
                <JobStatus enabled={job.enabled} lastStatus={job.last_status} />
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                <div>Next: {formatNext(job.next_run_at)}</div>
                {job.last_run_at && <div>Last: {formatNext(job.last_run_at)}</div>}
              </div>

              {job.prompt_preview && (
                <div style={{
                  background: '#0d0d12',
                  border: '1px solid var(--border)',
                  borderRadius: '0.375rem',
                  padding: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {job.prompt_preview}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
