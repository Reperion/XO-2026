// app/api/sessions/route.ts — Session list
import { NextRequest, NextResponse } from 'next/server';
import { getSessions, getSessionsByDate } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');
  const date = searchParams.get('date');

  try {
    let sessions;
    if (date) {
      sessions = getSessionsByDate(date);
    } else {
      sessions = getSessions(limit, offset);
    }
    return NextResponse.json({ sessions, limit, offset });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}
