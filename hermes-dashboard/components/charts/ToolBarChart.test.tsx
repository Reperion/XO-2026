import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToolBarChart from './ToolBarChart';

const mockData = [
  { name: 'Terminal', calls: 42 },
  { name: 'Patch', calls: 23 },
  { name: 'ReadFile', calls: 15 },
  { name: 'WriteFile', calls: 8 }
];

describe('ToolBarChart', () => {
  it('renders bar chart container', () => {
    render(<ToolBarChart data={mockData} />);
    expect(screen.getByTestId('tool-barchart')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<ToolBarChart data={mockData} />);
    expect(container).toMatchSnapshot();
  });
});
