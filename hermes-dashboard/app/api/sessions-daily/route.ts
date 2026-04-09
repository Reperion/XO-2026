import { NextRequest, NextResponse } from 'next/server';
import { getSessionsDaily } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const data = getSessionsDaily();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sessions daily' }, { status: 500 });
  }
}