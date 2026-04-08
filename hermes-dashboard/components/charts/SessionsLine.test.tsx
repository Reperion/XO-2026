import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SessionsLine from './SessionsLine';

const mockData = [
  { date: '2026-04-01', sessions: 5 },
  { date: '2026-04-02', sessions: 12 },
  { date: '2026-04-03', sessions: 8 },
  { date: '2026-04-04', sessions: 18 },
  { date: '2026-04-05', sessions: 22 },
  { date: '2026-04-06', sessions: 15 },
  { date: '2026-04-07', sessions: 30 }
];

describe('SessionsLine', () => {
  it('renders line chart container', () => {
    render(<SessionsLine data={mockData} />);
    expect(screen.getByTestId('sessions-line')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<SessionsLine data={mockData} />);
    expect(container).toMatchSnapshot();
  });
});
