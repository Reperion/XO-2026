import { render, screen } from '@testing-library/react';
import JobStatus from '../../../components/ui/JobStatus';

test('renders JobStatus paused', () => {
  render(<JobStatus enabled={false} lastStatus={null} />);
  expect(screen.getByText('paused')).toBeInTheDocument();
});
