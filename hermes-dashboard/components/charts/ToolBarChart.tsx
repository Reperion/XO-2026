import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FC } from 'react';

interface DataPoint {
  name: string;
  calls: number;
}

interface Props {
  data: DataPoint[];
}

const ToolBarChart: FC<Props> = ({ data }) => {
  return (
    <div data-testid="tool-barchart" className="w-full h-80 rounded-lg p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <h3 style={{ color: 'var(--foreground)', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Top Tools</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} tick={{ fill: 'var(--muted)', fontSize: 11 }} />
          <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'var(--foreground)' }}
            itemStyle={{ color: 'var(--foreground)' }}
            cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
          />
          <Bar dataKey="calls" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ToolBarChart;
