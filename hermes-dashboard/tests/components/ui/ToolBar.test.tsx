import { render, screen } from '@testing-library/react';
import ToolBar from '../../../components/ui/ToolBar';

test('renders ToolBar', () => {
  render(<ToolBar tool={{ tool_name: 'test', call_count: 5, last_used: Math.floor(Date.now() / 1000) }} maxCalls={10} />);
  expect(screen.getByText('test')).toBeInTheDocument();
  expect(screen.getByText('5')).toBeInTheDocument();
});
