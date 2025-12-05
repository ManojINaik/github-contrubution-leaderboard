import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AggregatedStats } from '../types';

interface StatsChartProps {
  data: AggregatedStats[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#06b6d4', '#3b82f6', '#f59e0b'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e293b]/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl">
        <p className="font-bold text-white mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="text-xs flex items-center justify-between gap-4 mb-1">
            <span className="text-gray-400 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              {entry.name}
            </span>
            <span className="font-mono text-white font-medium">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const StatsChart: React.FC<StatsChartProps> = ({ data }) => {
  const topData = data.slice(0, 10);
  const pieData = topData.map(d => ({ name: d.author, value: d.totalAdditions }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Activity Chart */}
      <div className="glass-card rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <div className="w-2 h-6 bg-primary rounded-full"></div>
          Contribution Activity
        </h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
              <XAxis 
                dataKey="author" 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 11 }} 
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 11 }} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff', opacity: 0.05 }} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }} 
                iconType="circle"
              />
              <Bar 
                dataKey="totalCommits" 
                name="Commits" 
                fill="#6366f1" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={40} 
                stackId="a"
              />
              <Bar 
                dataKey="totalPrs" 
                name="PRs" 
                fill="#ec4899" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={40} 
                stackId="b"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Volume Chart */}
      <div className="glass-card rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
           <div className="w-2 h-6 bg-accent rounded-full"></div>
           Code Volume Impact
        </h3>
        <div className="h-[350px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                iconType="circle"
                wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Text Overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
             <div className="text-3xl font-bold text-white">{topData.length}</div>
             <div className="text-xs text-gray-400 uppercase tracking-wider">Top Devs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsChart;