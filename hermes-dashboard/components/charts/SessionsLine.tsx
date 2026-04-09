import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FC } from 'react';

interface DataPoint {
  date: string;
  sessions: number;
}

interface Props {
  data: DataPoint[];
}

const SessionsLine: FC<Props> = ({ data }) => {
  return (
    <div data-testid="sessions-line" className="w-full h-80 rounded-lg p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <h3 style={{ color: 'var(--foreground)', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Sessions per Day</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fill: 'var(--muted)', fontSize: 11 }} />
          <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'var(--foreground)' }}
            itemStyle={{ color: 'var(--foreground)' }}
          />
          <Line type="monotone" dataKey="sessions" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6, fill: '#818cf8' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SessionsLine;
