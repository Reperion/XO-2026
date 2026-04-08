// app/api/jobs/route.ts — Cron jobs from Hermes cron/jobs.json
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const JOBS_FILE = path.join(process.env.HOME || '/home/lucid', '.hermes/cron/jobs.json');

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!fs.existsSync(JOBS_FILE)) {
      return NextResponse.json({ jobs: [], error: 'No cron jobs file found' });
    }
    const raw = fs.readFileSync(JOBS_FILE, 'utf-8');
    const data = JSON.parse(raw);
    const jobs = (data.jobs || []).map((j: Record<string, unknown>) => ({
      job_id: j.id,
      name: j.name,
      skill: j.skill,
      skills: j.skills || [],
      prompt_preview: typeof j.prompt === 'string' ? j.prompt.slice(0, 200) : '',
      model: j.model || '',
      provider: j.provider || '',
      schedule: j.schedule_display || '',
      repeat: (j.repeat as { times?: number })?.times ?? null,
      next_run_at: j.next_run_at,
      last_run_at: j.last_run_at,
      last_status: j.last_status,
      last_delivery_error: j.last_error,
      enabled: j.enabled ?? true,
      paused_at: j.paused_at,
      paused_reason: j.paused_reason,
    }));
    return NextResponse.json({ jobs });
  } catch (err) {
    return NextResponse.json({ jobs: [], error: 'Failed to read jobs' }, { status: 500 });
  }
}
