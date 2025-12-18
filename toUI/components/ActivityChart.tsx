
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartDataPoint } from '../types';

const data: ChartDataPoint[] = [
  { date: '12/12', keywordMining: 400, batchTranslation: 240, deepMining: 240 },
  { date: '12/13', keywordMining: 300, batchTranslation: 139, deepMining: 221 },
  { date: '12/14', keywordMining: 200, batchTranslation: 980, deepMining: 229 },
  { date: '12/15', keywordMining: 278, batchTranslation: 390, deepMining: 200 },
  { date: '12/16', keywordMining: 189, batchTranslation: 480, deepMining: 218 },
  { date: '12/17', keywordMining: 239, batchTranslation: 380, deepMining: 250 },
  { date: '12/18', keywordMining: 349, batchTranslation: 430, deepMining: 210 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border border-[#1a1a1a] p-3 rounded-sm shadow-xl font-mono text-[10px]">
        <p className="text-emerald-500 mb-2 font-bold underline">DATE_STAMP: {label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="flex justify-between gap-4 py-0.5" style={{ color: entry.color }}>
            <span className="uppercase">{entry.name}:</span>
            <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ActivityChart: React.FC = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorKw" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorBt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorDm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#4b5563', fontSize: 10, fontFamily: 'monospace' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#4b5563', fontSize: 10, fontFamily: 'monospace' }} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', paddingBottom: '20px' }}
          />
          <Area 
            name="关键词挖掘" 
            type="monotone" 
            dataKey="keywordMining" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorKw)" 
          />
          <Area 
            name="批量翻译" 
            type="monotone" 
            dataKey="batchTranslation" 
            stroke="#10b981" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorBt)" 
          />
          <Area 
            name="深度挖掘" 
            type="monotone" 
            dataKey="deepMining" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorDm)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;
