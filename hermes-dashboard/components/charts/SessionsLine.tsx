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
    <div data-testid="sessions-line" className="w-full h-80 bg-white rounded-lg shadow-lg p-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sessions" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SessionsLine;
