'use client';

import { useEffect, useState } from 'react';
import JobCard from '@/components/ui/JobCard';
import type { CronJob } from '@/lib/types';

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
      } catch {
        setError('Cannot connect to Hermes API. Is the gateway running?');
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-muted-foreground">Loading jobs...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Cron Jobs</h1>
        <p className="text-sm text-muted-foreground">
          Hermes cron jobs — autonomous tasks that wake XO throughout the day
        </p>
      </div>

      {error ? (
        <div className="bg-card border border-error rounded-lg p-4 text-error">
          {error}
          <div className="text-xs mt-2 text-muted-foreground">
            The Hermes API server runs at 127.0.0.1:8642. Start it with: python -m hermes_agent.gateway.run
          </div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-muted-foreground">No cron jobs configured</div>
      ) : (
        jobs.map((job) => (
          <JobCard key={job.job_id} job={job} />
        ))
      )}
    </div>
  );
}
