// app/api/jobs/route.ts — Cron jobs from Hermes API
import { NextResponse } from 'next/server';
import { getJobs } from '@/lib/hermes-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const jobs = await getJobs();
    return NextResponse.json({ jobs });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
