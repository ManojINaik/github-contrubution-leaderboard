import React, { useState } from 'react';
import RepoInput from './components/RepoInput';
import StatsChart from './components/StatsChart';
import StatsTable from './components/StatsTable';
import Leaderboard from './components/Leaderboard';
import { analyzeRepo } from './services/githubService';
import { generateAIReport } from './services/geminiService';
import { AnalysisResult, AnalysisStatus } from './types';
import { BrainCircuit, Github, AlertCircle, Activity, GitCommit, GitPullRequest, Code2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [aiReport, setAiReport] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleAnalyze = async (url: string, token: string) => {
    setStatus(AnalysisStatus.FETCHING_CONTRIBUTORS);
    setError('');
    setData(null);
    setAiReport('');

    try {
      const cleanUrl = url.endsWith('.git') ? url.slice(0, -4) : url;
      const urlObj = new URL(cleanUrl);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      if (pathParts.length < 2) {
        throw new Error('Invalid GitHub URL format. Expected: https://github.com/owner/repo');
      }
      
      const owner = pathParts[0];
      const repo = pathParts[1];

      const result = await analyzeRepo(owner, repo, token);
      setData(result);
      
      setStatus(AnalysisStatus.ANALYZING);
      const report = await generateAIReport(result);
      setAiReport(report);
      
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred');
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden selection:bg-indigo-500/30">
      
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/50 blur-lg rounded-full"></div>
              <div className="relative bg-gradient-to-br from-primary to-accent p-2 rounded-xl border border-white/20 shadow-lg">
                <Github className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight">
              GitPulse AI
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-accent" />
              Gemini 2.5 Flash
            </span>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-16">
        
        {/* Hero & Input */}
        <div className="flex flex-col items-center justify-center space-y-8 animate-slide-up">
           <RepoInput 
             onAnalyze={handleAnalyze} 
             loading={status !== AnalysisStatus.IDLE && status !== AnalysisStatus.COMPLETED && status !== AnalysisStatus.ERROR} 
           />
           
           {error && (
            <div className="w-full max-w-2xl p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 backdrop-blur-md animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Results Dashboard */}
        {data && (
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            
            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                   <GitCommit className="w-16 h-16 text-primary" />
                </div>
                <div className="text-secondary text-xs font-semibold uppercase tracking-wider mb-2">Total Commits</div>
                <div className="text-3xl font-bold text-white tracking-tight">{data.totalCommits.toLocaleString()}</div>
                <div className="text-xs text-primary mt-1 font-medium">Recorded History</div>
              </div>
              
              <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                   <GitPullRequest className="w-16 h-16 text-accent" />
                </div>
                <div className="text-secondary text-xs font-semibold uppercase tracking-wider mb-2">PRs Analyzed</div>
                <div className="text-3xl font-bold text-white tracking-tight">{data.prCount.toLocaleString()}</div>
                <div className="text-xs text-accent mt-1 font-medium">Recent Activity</div>
              </div>
              
              <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Code2 className="w-16 h-16 text-emerald-500" />
                </div>
                <div className="text-secondary text-xs font-semibold uppercase tracking-wider mb-2">Lines Changed</div>
                <div className="text-3xl font-bold text-white tracking-tight">{data.totalLinesChanged.toLocaleString()}</div>
                <div className="text-xs text-emerald-400 mt-1 font-medium">Impact Volume</div>
              </div>

              <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Activity className="w-16 h-16 text-orange-500" />
                </div>
                <div className="text-secondary text-xs font-semibold uppercase tracking-wider mb-2">Contributors</div>
                <div className="text-3xl font-bold text-white tracking-tight">{data.stats.length.toLocaleString()}</div>
                <div className="text-xs text-orange-400 mt-1 font-medium">Active Members</div>
              </div>
            </div>

            {/* AI Report - Feature Card */}
            <div className="glass-card rounded-2xl p-1 shadow-2xl">
              <div className="bg-surface/50 rounded-xl p-8 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
                    <BrainCircuit className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">AI Analysis Report</h2>
                </div>
                
                <div className="prose prose-invert prose-sm md:prose-base max-w-none text-slate-300 leading-relaxed relative z-10">
                  {aiReport ? (
                     <ReactMarkdown components={{
                        strong: ({node, ...props}) => <span className="text-indigo-400 font-bold" {...props} />,
                        li: ({node, ...props}) => <li className="marker:text-indigo-500" {...props} />
                     }}>{aiReport}</ReactMarkdown>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="h-4 bg-white/5 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-white/5 rounded animate-pulse w-full"></div>
                      <div className="h-4 bg-white/5 rounded animate-pulse w-5/6"></div>
                      <div className="flex items-center gap-2 text-indigo-400 text-sm mt-2">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        Generating deep insights with Gemini...
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <Leaderboard data={data.stats} />

            {/* Charts & Graphs */}
            <StatsChart data={data.stats} />

            {/* Detailed Data Table */}
            <StatsTable data={data.stats} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;