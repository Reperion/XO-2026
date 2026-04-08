// Hermes Dashboard — Hermes API Client
// Hermes has an API server at 127.0.0.1:8642

const HERMES_API = process.env.HERMES_API_URL || 'http://127.0.0.1:8642';

export interface HermesJob {
  job_id: string;
  name: string;
  skill: string | null;
  skills: string[];
  prompt_preview: string;
  model: string;
  provider: string;
  base_url: string | null;
  schedule: string;
  repeat: number | null;
  next_run_at: string | null;
  last_run_at: string | null;
  last_status: string | null;
  last_delivery_error: string | null;
  enabled: boolean;
  paused_at: string | null;
  paused_reason: string | null;
}

export async function getJobs(): Promise<HermesJob[]> {
  try {
    const res = await fetch(`${HERMES_API}/api/jobs`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.jobs || [];
  } catch {
    return [];
  }
}

export async function getJob(jobId: string): Promise<HermesJob | null> {
  try {
    const res = await fetch(`${HERMES_API}/api/jobs/${jobId}`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function runJob(jobId: string): Promise<boolean> {
  try {
    const res = await fetch(`${HERMES_API}/api/jobs/${jobId}/run`, {
      method: 'POST',
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function pauseJob(jobId: string): Promise<boolean> {
  try {
    const res = await fetch(`${HERMES_API}/api/jobs/${jobId}/pause`, {
      method: 'POST',
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function resumeJob(jobId: string): Promise<boolean> {
  try {
    const res = await fetch(`${HERMES_API}/api/jobs/${jobId}/resume`, {
      method: 'POST',
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
