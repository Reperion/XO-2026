import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DashboardPage from '@/app/page';

const mockFetch = vi.fn();

global.fetch = mockFetch as any;

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total_sessions: 42, total_messages: 123 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sessions: [] }),
      } as Response);
  });

  it('renders dashboard', async () => {
    const { container } = render(<DashboardPage />);
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
    expect(container).toMatchSnapshot();
  });

  it('shows search input', async () => {
    render(<DashboardPage />);
    const input = await screen.findByPlaceholderText(/search/i);
    expect(input).toBeInTheDocument();
  });

  it('fetches and shows search results on input', async () => {
    const mockSearchRes = {
      ok: true,
      json: async () => ([{ type: 'message', id: '1', preview: 'test preview', snippet: 'test snippet', session_id: 's1', timestamp: 1234567890 }]),
    } as Response;

    render(<DashboardPage />);
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'test' } });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/search?q=test'));
    });

    await waitFor(() => {
      expect(screen.getByText('test preview')).toBeInTheDocument();
    });
  });
});
