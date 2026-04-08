import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TokenPie from './TokenPie';

const mockData = {
  inputTokens: 100000,
  outputTokens: 50000
};

describe('TokenPie', () => {
  it('renders pie chart container', () => {
    render(<TokenPie {...mockData} />);
    expect(screen.getByTestId('token-pie')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<TokenPie {...mockData} />);
    expect(container).toMatchSnapshot();
  });
});
