import { describe, it, expect, vi } from 'vitest';
import { GET } from '@/app/api/search/route';
import type { SearchHit } from '@/lib/types';

describe('search API', () => {
  it('returns empty array for no query', async () => {
    const req = new Request('http://localhost/api/search');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });

  it('handles query param', async () => {
    const url = new URL('http://localhost/api/search?q=test');
    const req = new Request(url);
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
