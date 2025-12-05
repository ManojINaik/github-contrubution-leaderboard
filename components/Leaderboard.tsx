import React from 'react';
import { AggregatedStats } from '../types';
import { Trophy, Medal, GitCommit, Zap, History } from 'lucide-react';

interface LeaderboardProps {
  data: AggregatedStats[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  const topThree = [...data.slice(0, 3)];
  while (topThree.length < 3) {
    topThree.push({
      author: 'Unknown',
      avatarUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
      totalCommits: 0,
      totalAdditions: 0,
      totalDeletions: 0,
      totalPrs: 0,
      netLines: 0,
      impactScore: 0,
      lastActive: '',
      firstActive: '',
      velocity: 0,
      consistency: 0
    });
  }

  const podiumOrder = [topThree[1], topThree[0], topThree[2]];
  
  const getRankStyle = (index: number) => {
    if (index === 1) return { 
      rank: 1,
      badge: 'bg-gradient-to-br from-yellow-300 to-yellow-600',
      border: 'border-yellow-500/30',
      shadow: 'shadow-yellow-500/20',
      text: 'text-yellow-400',
      height: 'h-[420px]',
      crown: true
    };
    if (index === 0) return { 
      rank: 2, 
      badge: 'bg-gradient-to-br from-slate-300 to-slate-500',
      border: 'border-slate-400/30',
      shadow: 'shadow-slate-500/20',
      text: 'text-slate-300',
      height: 'h-[380px]',
      crown: false
    };
    return { 
      rank: 3, 
      badge: 'bg-gradient-to-br from-orange-300 to-orange-600',
      border: 'border-orange-500/30',
      shadow: 'shadow-orange-500/20',
      text: 'text-orange-400',
      height: 'h-[360px]',
      crown: false
    };
  };

  return (
    <div className="relative pt-10 pb-6">
       <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Top Contributors
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-transparent via-indigo-500 to-transparent mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="flex items-end justify-center gap-4 md:gap-6 px-4">
        {podiumOrder.map((user, index) => {
          const style = getRankStyle(index);
          const isWinner = style.rank === 1;

          return (
            <div 
              key={`${user.author}-${index}`}
              className={`relative w-full max-w-[280px] flex flex-col ${style.height} transition-all duration-500 group hover:-translate-y-2`}
            >
              {/* Card Container */}
              <div className={`absolute inset-0 glass-card rounded-2xl ${style.border} flex flex-col items-center pt-12 pb-6 px-4 overflow-hidden`}>
                
                {/* Background Glow */}
                <div className={`absolute top-0 inset-x-0 h-32 opacity-20 bg-gradient-to-b ${isWinner ? 'from-yellow-500' : style.rank === 2 ? 'from-slate-500' : 'from-orange-500'} to-transparent pointer-events-none`}></div>

                {/* Rank Badge */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl rotate-45 flex items-center justify-center shadow-lg z-20 ${style.badge}`}>
                  <span className="-rotate-45 font-bold text-black text-lg">#{style.rank}</span>
                </div>

                {/* Avatar */}
                <div className="relative mb-6">
                  {isWinner && <div className="absolute -inset-4 bg-yellow-500/30 rounded-full blur-xl animate-pulse"></div>}
                  <div className={`relative p-1 rounded-full bg-gradient-to-br ${isWinner ? 'from-yellow-300 to-yellow-600' : 'from-white/10 to-white/5'}`}>
                    <img 
                      src={user.avatarUrl} 
                      alt={user.author} 
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-background object-cover shadow-2xl"
                    />
                  </div>
                  {isWinner && (
                    <Trophy className="absolute -top-6 -right-2 w-8 h-8 text-yellow-400 drop-shadow-lg rotate-12" />
                  )}
                </div>

                {/* Name */}
                <a 
                  href={`https://github.com/${user.author}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-lg md:text-xl font-bold text-white mb-1 hover:text-primary transition-colors truncate w-full text-center"
                >
                   {user.author === 'Unknown' ? '---' : user.author}
                </a>
                
                <div className="w-full mt-6 space-y-3">
                  {/* Impact Score */}
                  <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                     <span>Impact Score</span>
                     <span className={`font-mono font-bold ${style.text}`}>{Math.round(user.impactScore || 0)}</span>
                  </div>
                  
                  {/* Consistency Bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                      <span>Consistency</span>
                      <span>{Math.round((user.consistency || 0) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isWinner ? 'bg-yellow-500' : 'bg-indigo-500'}`} 
                        style={{ width: `${(user.consistency || 0) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5">
                    <div className="bg-background/50 rounded-lg p-2 text-center">
                       <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 mb-1">
                          <GitCommit className="w-3 h-3" /> Commits
                       </div>
                       <div className="font-mono text-sm text-white font-semibold">{user.totalCommits}</div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-2 text-center">
                       <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 mb-1">
                          <Zap className="w-3 h-3" /> Velocity
                       </div>
                       <div className="font-mono text-sm text-white font-semibold">
                         {user.velocity ? user.velocity.toFixed(1) : '0'}/wk
                       </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;