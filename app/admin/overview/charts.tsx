'use client';

import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const Charts = ({
  data: { salesData },
}: {
  data: { salesData: { month: string; totalSales: number }[] };
}) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={salesData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />

        <XAxis
          dataKey="month"
          stroke="#8884d8"
          fontSize={12}
          tickLine={true}
          axisLine={true}
        />

        <YAxis
          stroke="#8884d8"
          fontSize={12}
          tickLine={true}
          axisLine={true}
          tickFormatter={(value) => `$${value}`}
        />

        {/* Tooltip and Legend for better visualization */}
        <Tooltip />
        <Legend />

        <Bar
          dataKey="totalSales"
          fill="#4CAF50"
          radius={[4, 4, 0, 0]}
          className="fill-slate-700"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Charts;
