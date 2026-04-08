import React from 'react';
import type { CronJob } from '@/lib/types';
import { formatNext } from '@/lib/utils';
import JobStatus from './JobStatus';

interface JobCardProps {
  job: CronJob;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => (
  <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 mb-3">
    <div className="flex justify-between items-start">
      <div>
        <div className="font-semibold mb-1">{job.name}</div>
        <div className="font-mono text-xs text-[var(--muted)] mb-2">{job.schedule} · {job.repeat ? `${job.repeat}x` : '∞'} · ID: {job.job_id}</div>
      </div>
      <JobStatus enabled={job.enabled} lastStatus={job.last_status} />
    </div>
    <div className="text-xs text-[var(--muted)] mb-2">
      <div>Next: {formatNext(job.next_run_at)}</div>
      {job.last_run_at && <div>Last: {formatNext(job.last_run_at)}</div>}
    </div>
    {job.prompt_preview && (
      <div className="bg-[#0d0d12] border border-[var(--border)] rounded-md p-2 text-xs text-[var(--muted)] overflow-hidden text-ellipsis whitespace-nowrap">
        {job.prompt_preview}
      </div>
    )}
  </div>
);

export default JobCard;
