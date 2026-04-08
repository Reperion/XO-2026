import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import XoPage from '@/app/xo/page';

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch as any;
});

describe('XoPage', () => {
  it('renders file list dropdown', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([
        { name: 'MEMORY.md' },
        { name: 'AGENTS.md' }
      ])
    } as Response);

    render(<XoPage />);
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
    expect(screen.getByText('MEMORY.md')).toBeInTheDocument();
  });

  it('renders MD content for selected file', async () => {
    const mdContent = `# Test MD

| Col1 | Col2 |
|------|------|
| A    | B    |`;

    mockFetch
      .mockResolvedValueOnce({ 
        ok: true, 
        json: async () => [{ name: 'test.md' }] 
      } as Response)
      .mockResolvedValueOnce({ 
        ok: true, 
        json: async () => mdContent 
      } as Response);

    render(<XoPage />);
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'test.md' } });

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Test MD/i })).toBeInTheDocument();
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('Col1')).toBeInTheDocument();
    });
  });
});
