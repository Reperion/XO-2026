import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import { FC } from 'react';

interface Props {
  inputTokens: number;
  outputTokens: number;
}

const TokenPie: FC<Props> = ({ inputTokens, outputTokens }) => {
  const data = [
    { name: 'Input Tokens', value: inputTokens },
    { name: 'Output Tokens', value: outputTokens },
  ];
  const COLORS = ['#6366f1', '#22c55e'];

  return (
    <div data-testid="token-pie" className="w-full h-80 rounded-lg p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <h3 style={{ color: 'var(--foreground)', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Token Distribution</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            nameKey="name"
            label={(props: any) => `${props.name ?? ''} ${((props.percent ?? 0) * 100).toFixed(0)}%`}
            stroke="var(--border)"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'var(--foreground)' }}
            itemStyle={{ color: 'var(--foreground)' }}
          />
          <Legend wrapperStyle={{ color: 'var(--muted)', fontSize: '0.75rem' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TokenPie;
