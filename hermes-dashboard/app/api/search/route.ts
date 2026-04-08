import { NextRequest, NextResponse } from 'next/server';
import type { SearchHit } from '@/lib/types';
import { searchGlobal } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json([] as SearchHit[]);
  }

  const results = searchGlobal(q, 50);
  return NextResponse.json(results);
}
