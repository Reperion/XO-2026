import { FC } from 'react';
import TokenPie from './TokenPie';
import ToolBarChart from './ToolBarChart';
import SessionsLine from './SessionsLine';
import type { SessionStats } from '@/lib/types';

interface ToolData {
  name: string;
  calls: number;
}

interface DailyData {
  date: string;
  sessions: number;
}

interface Props {
  stats: SessionStats;
  toolData: ToolData[];
  dailyData: DailyData[];
}

const ChartsGrid: FC<Props> = ({ stats, toolData, dailyData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" data-testid="charts-grid">
      <TokenPie inputTokens={stats.total_input_tokens ?? 0} outputTokens={stats.total_output_tokens ?? 0} />
      <ToolBarChart data={toolData} />
      <SessionsLine data={dailyData} />
    </div>
  );
};

export default ChartsGrid;
