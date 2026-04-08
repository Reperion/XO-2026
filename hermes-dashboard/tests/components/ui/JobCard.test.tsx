import { render, screen } from '@testing-library/react';
import JobCard from '../../../components/ui/JobCard';

test('renders JobCard', () => {
  const job = { name: 'test', job_id: 'test', schedule: 'test', enabled: true, last_status: null, next_run_at: null };
  render(<JobCard job={job} />);
  expect(screen.getByText('test')).toBeInTheDocument();
});
