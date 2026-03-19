"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartData {
  time: string;
  temp: number;
}

export function LiveColdChainChart({ data }: { data: ChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="time" axisLine={false} tickLine={false} fontSize={12} stroke="#888888" />
        <YAxis domain={[0, 10]} axisLine={false} tickLine={false} fontSize={12} stroke="#888888" tickFormatter={(v) => `${v}°`} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: 'white' }} 
          itemStyle={{ color: '#fff' }}
        />
        <Line 
          type="monotone" 
          dataKey="temp" 
          stroke="#3b82f6" 
          strokeWidth={3} 
          dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: 'white' }} 
          activeDot={{ r: 6 }} 
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
