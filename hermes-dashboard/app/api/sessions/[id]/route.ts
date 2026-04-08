// app/api/sessions/[id]/route.ts — Single session
import { NextRequest, NextResponse } from 'next/server';
import { getSessionById } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = getSessionById(id);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    return NextResponse.json(session);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}
