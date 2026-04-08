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
    <div data-testid="tool-barchart" className="w-full h-80 bg-white rounded-lg shadow-lg p-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="calls" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ToolBarChart;
