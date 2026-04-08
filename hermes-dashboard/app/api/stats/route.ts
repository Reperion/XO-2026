// app/api/stats/route.ts — Dashboard overview stats
import { NextResponse } from 'next/server';
import { getSessionStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = getSessionStats();
    return NextResponse.json(stats);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
