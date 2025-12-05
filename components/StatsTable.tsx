import React from 'react';
import { AggregatedStats } from '../types';
import { GitCommit, GitPullRequest, ArrowUpRight, Calendar, Activity } from 'lucide-react';

interface StatsTableProps {
  data: AggregatedStats[];
}

const StatsTable: React.FC<StatsTableProps> = ({ data }) => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          Contributor Breakdown
        </h3>
        <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">
           Sorted by Impact Score
        </span>
      </div>
      
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-[#0f1623] shadow-md">
            <tr className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
              <th className="p-5 pl-8">Contributor</th>
              <th className="p-5 text-right">Commits</th>
              <th className="p-5 text-right">PRs</th>
              <th className="p-5 text-right">Velocity</th>
              <th className="p-5 w-32">Consistency</th>
              <th className="p-5 text-right">Net Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {data.map((stat, index) => (
              <tr 
                key={stat.author} 
                className="hover:bg-white/[0.02] transition-colors group"
              >
                <td className="p-5 pl-8">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600 font-mono text-xs w-4">#{index + 1}</span>
                    <div className="relative">
                      <img 
                        src={stat.avatarUrl} 
                        alt={stat.author} 
                        className="w-10 h-10 rounded-full border border-white/10 group-hover:border-indigo-500/50 transition-colors"
                      />
                      {index < 3 && (
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-background flex items-center justify-center text-[8px] font-bold text-black
                          ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-slate-300' : 'bg-orange-400'}`}>
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <a 
                        href={`https://github.com/${stat.author}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-bold text-gray-200 group-hover:text-indigo-400 transition-colors flex items-center gap-1"
                      >
                        {stat.author}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                      <span className="text-xs text-gray-500">
                        Joined {new Date(stat.firstActive || Date.now()).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </td>
                
                <td className="p-5 text-right font-mono text-gray-300">
                  {stat.totalCommits.toLocaleString()}
                </td>
                
                <td className="p-5 text-right font-mono text-gray-300">
                  {stat.totalPrs.toLocaleString()}
                </td>

                <td className="p-5 text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 text-xs font-medium text-gray-300 border border-white/5">
                     {stat.velocity ? stat.velocity.toFixed(1) : '0'} / wk
                  </span>
                </td>

                <td className="p-5">
                   <div className="flex items-center gap-2">
                     <div className="flex-1 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                         style={{ width: `${(stat.consistency || 0) * 100}%` }}
                       ></div>
                     </div>
                     <span className="text-xs text-gray-500 w-8 text-right">
                       {Math.round((stat.consistency || 0) * 100)}%
                     </span>
                   </div>
                </td>

                <td className="p-5 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className={`font-mono font-bold ${stat.netLines > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stat.netLines > 0 ? '+' : ''}{stat.netLines.toLocaleString()}
                    </span>
                    <div className="flex gap-2 text-[10px]">
                      <span className="text-emerald-500/70">+{stat.totalAdditions}</span>
                      <span className="text-rose-500/70">-{stat.totalDeletions}</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsTable;