import { describe, it, expect, vi } from 'vitest';
import { GET } from '@/app/api/xo-files/route';

describe('xo-files API', () => {
  it('lists .md files from /home/lucid/xo/', async () => {
    const req = new Request('http://localhost/api/xo-files');
    const res = await GET(req as any);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty('name');
expect(data[0].name.endsWith('.md'));
  });

  it('returns file content when ?file= param given', async () => {
    const url = new URL('http://localhost/api/xo-files?file=MEMORY.md');
    const req = new Request(url);
    const res = await GET(req as any);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(typeof data).toBe('string');
    expect(data).toContain('XO Memory');
  });

  it('returns 404 for non-existent file', async () => {
    const url = new URL('http://localhost/api/xo-files?file=nonexistent.md');
    const req = new Request(url);
    const res = await GET(req as any);
    expect(res.status).toBe(404);
  });
});
