import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChartsGrid from './ChartsGrid';

const mockStats = {
  total_input_tokens: 100000,
  total_output_tokens: 50000
};

const mockToolData = [
  { name: 'Terminal', calls: 42 },
  { name: 'Patch', calls: 23 },
  { name: 'ReadFile', calls: 15 },
  { name: 'WriteFile', calls: 8 }
];

const mockDailyData = [
  { date: '2026-04-01', sessions: 5 },
  { date: '2026-04-02', sessions: 12 },
  { date: '2026-04-03', sessions: 8 }
];

describe('ChartsGrid', () => {
  it('renders all three charts', () => {
    render(<ChartsGrid
      stats={mockStats}
      toolData={mockToolData}
      dailyData={mockDailyData}
    />);
    expect(screen.getByTestId('token-pie')).toBeInTheDocument();
    expect(screen.getByTestId('tool-barchart')).toBeInTheDocument();
    expect(screen.getByTestId('sessions-line')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<ChartsGrid
      stats={mockStats}
      toolData={mockToolData}
      dailyData={mockDailyData}
    />);
    expect(container).toMatchSnapshot();
  });
});
