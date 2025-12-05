import React, { useState } from 'react';
import { Github, Lock, Search, ArrowRight } from 'lucide-react';

interface RepoInputProps {
  onAnalyze: (url: string, token: string) => void;
  loading: boolean;
}

const RepoInput: React.FC<RepoInputProps> = ({ onAnalyze, loading }) => {
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onAnalyze(url, token);
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 mb-6 tracking-tight">
          Analyze. Rank. <span className="text-indigo-500">Optimize.</span>
        </h1>
        <p className="text-lg text-secondary max-w-lg mx-auto leading-relaxed">
          Deep dive into your GitHub repository's DNA. Uncover hidden contributors, velocity trends, and code impact with AI.
        </p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative glass-card rounded-2xl p-1.5 md:p-2">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
            
            {/* URL Input */}
            <div className="relative flex-grow group/input">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-white transition-colors">
                <Github className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="github.com/owner/repo"
                className="w-full h-14 bg-surface/50 border border-transparent focus:border-white/10 text-white pl-12 pr-4 rounded-xl outline-none placeholder:text-gray-600 transition-all focus:bg-surface"
                required
              />
            </div>

            {/* Token Input (Desktop) */}
            <div className="relative md:w-1/3 group/token">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/token:text-white transition-colors">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Token (Optional)"
                className="w-full h-14 bg-surface/50 border border-transparent focus:border-white/10 text-white pl-10 pr-4 rounded-xl outline-none placeholder:text-gray-600 transition-all focus:bg-surface text-sm"
              />
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className={`h-14 md:px-8 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg ${
                loading
                  ? 'bg-surface text-gray-500 cursor-not-allowed border border-white/5'
                  : 'bg-white text-black hover:bg-gray-100 hover:scale-[1.02] hover:shadow-white/10'
              }`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent" />
              ) : (
                <>
                  Analyze <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-4 flex justify-center">
         <a 
          href="https://github.com/settings/tokens/new?scopes=repo" 
          target="_blank" 
          rel="noreferrer" 
          className="text-[11px] text-gray-500 hover:text-indigo-400 transition-colors flex items-center gap-1"
        >
          <Lock className="w-3 h-3" />
          Need to access private repos? Generate a token
        </a>
      </div>
    </div>
  );
};

export default RepoInput;