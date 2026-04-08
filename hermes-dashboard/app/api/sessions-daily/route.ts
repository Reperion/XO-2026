import { NextResponse } from 'next/server';
import { getSessionsDaily } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = getSessionsDaily();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch daily sessions' }, { status: 500 });
  }
}
