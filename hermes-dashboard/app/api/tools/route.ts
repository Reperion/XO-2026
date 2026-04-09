import { NextResponse } from 'next/server';
import { getToolUsage } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = getToolUsage();
    return NextResponse.json({ tools: data });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
  }
}
