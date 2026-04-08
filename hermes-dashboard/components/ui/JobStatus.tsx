import React from 'react';

interface JobStatusProps {
  enabled: boolean;
  lastStatus: string | null;
}

const JobStatus: React.FC<JobStatusProps> = ({ enabled, lastStatus }) => {
  if (!enabled) return <span className="text-[var(--muted)] text-[0.8rem]">paused</span>;
  if (lastStatus === 'success') return <span className="text-[var(--success)] text-[0.8rem]">✓ ok</span>;
  if (lastStatus === 'error') return <span className="text-[var(--error)] text-[0.8rem]">✗ error</span>;
  return <span className="text-[var(--muted)] text-[0.8rem]">—</span>;
};

export default JobStatus;
