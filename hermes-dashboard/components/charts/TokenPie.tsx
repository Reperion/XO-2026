import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from 'recharts';
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
  const COLORS = ['#0088FE', '#00C49F'];

  return (
    <div data-testid="token-pie" className="w-full h-80 bg-white rounded-lg shadow-lg p-6">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            nameKey="name"
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TokenPie;
