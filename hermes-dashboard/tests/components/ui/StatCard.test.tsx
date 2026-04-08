import { render, screen } from '@testing-library/react';
import StatCard from '../../../components/ui/StatCard';

test('renders StatCard with label and value', () => {
  render(<StatCard label="Test Label" value="123" />);
  expect(screen.getByText('Test Label')).toBeInTheDocument();
  expect(screen.getByText('123')).toBeInTheDocument();
});
