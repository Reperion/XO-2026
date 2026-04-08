// app/api/tools/route.ts — Tool usage stats
import { NextResponse } from 'next/server';
import { getToolUsage } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tools = getToolUsage();
    return NextResponse.json({ tools });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
  }
}
