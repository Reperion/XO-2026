import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

const XO_BASE = '/home/lucid/xo';

async function getMdFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const subfiles = await getMdFiles(full);
      files.push(...subfiles.map(sub => path.join(entry.name, sub)));
    } else if (entry.name.endsWith('.md')) {
      files.push(entry.name);
    }
  }
  return files.sort();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (file) {
    const safePath = path.resolve(XO_BASE, path.normalize(file));
    if (!safePath.startsWith(XO_BASE)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    try {
      const content = await fs.readFile(safePath, 'utf8');
      return NextResponse.json(content);
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }

  try {
    const files = await getMdFiles(XO_BASE);
    return NextResponse.json(files.map(f => ({ name: f })));
  } catch (e) {
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}
