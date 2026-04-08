import { render, screen } from '@testing-library/react';
import SessionRow from '../../../components/ui/SessionRow';

test('renders SessionRow', () => {
  const session = { id: 'test', title: 'Test Session', source: 'test', model: 'test', started_at: 0, message_count: 1, tool_call_count: 0 };
  render(<SessionRow session={session} />);
  expect(screen.getByText('Test Session')).toBeInTheDocument();
});
