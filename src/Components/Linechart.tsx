"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
} from "recharts";

export default function LineGraph({
  data,
}: {
  data: { date: string; apy: number }[];
}) {
  return (
    <div className="w-full h-[400px] md:h-[600px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorApy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            minTickGap={10} 
            tick={{ fontSize: 12 }}
            className="text-xs md:text-sm"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            className="text-xs md:text-sm"
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />

          <Line
            type="monotone"
            dataKey="apy"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />

          <Area
            type="monotone"
            dataKey="apy"
            fill="url(#colorApy)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
