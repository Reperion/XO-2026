// app/api/sessions/[id]/messages/route.ts — Messages for a session
import { NextRequest, NextResponse } from 'next/server';
import { getMessagesBySession } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const messages = getMessagesBySession(id);
    return NextResponse.json({ messages });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
