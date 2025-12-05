import { ContributorStat, PrStat, AggregatedStats, AnalysisResult, RepoDetails } from '../types';

const BASE_URL = 'https://api.github.com';

export const parseRepoUrl = (url: string): RepoDetails | null => {
  try {
    const cleanUrl = url.endsWith('.git') ? url.slice(0, -4) : url;
    const urlObj = new URL(cleanUrl);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    if (pathParts.length >= 2) {
      return {
        owner: pathParts[0],
        repo: pathParts[1]
      };
    }
    return null;
  } catch (e) {
    return null;
  }
};

const getHeaders = (token?: string) => {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  return headers;
};

// Retry logic for the stats endpoint which returns 202 while calculating
const fetchContributorStats = async (owner: string, repo: string, token?: string, retries = 20): Promise<ContributorStat[]> => {
  const url = `${BASE_URL}/repos/${owner}/${repo}/stats/contributors`;
  
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, { headers: getHeaders(token) });
    
    if (response.status === 200) {
      const data = await response.json();
      // Sometimes it returns an empty array if empty, or object if calculating
      if (Array.isArray(data)) {
        return data;
      }
    } else if (response.status === 202) {
      // GitHub is calculating stats. Wait and retry.
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s
    } else if (response.status === 204) {
      return []; // No content
    } else {
       if (response.status === 401) throw new Error("Unauthorized. Please check your GitHub Token.");
       if (response.status === 403) throw new Error("API Rate limit exceeded or Forbidden. Try adding a Token.");
       if (response.status === 404) throw new Error("Repository not found or private (check token).");
       throw new Error(`GitHub API Error: ${response.statusText}`);
    }
  }
  throw new Error("Timeout waiting for GitHub statistics calculation. The repository might be too large or GitHub is busy.");
};

// Fetch recent merged PRs
const fetchRecentPrs = async (owner: string, repo: string, token?: string): Promise<PrStat[]> => {
  // We use the pulls endpoint instead of search for better consistency.
  // We fetch closed PRs and filter for those that have been merged.
  const url = `${BASE_URL}/repos/${owner}/${repo}/pulls?state=closed&sort=updated&direction=desc&per_page=100`;
  
  const response = await fetch(url, { headers: getHeaders(token) });
  if (!response.ok) {
     console.warn("Failed to fetch PRs", response.statusText);
     return [];
  }
  
  const data = await response.json();
  // Filter for actually merged PRs (merged_at is not null)
  return data.filter((pr: any) => pr.merged_at !== null);
};

export const analyzeRepo = async (owner: string, repo: string, token?: string): Promise<AnalysisResult> => {
  
  // 1. Fetch Code Frequency / Contributor Stats
  const stats = await fetchContributorStats(owner, repo, token);

  // 2. Fetch Recent PRs
  const prs = await fetchRecentPrs(owner, repo, token);

  // 3. Aggregate Data
  const aggregated: Record<string, AggregatedStats> = {};

  // Process Code Stats
  stats.forEach((stat) => {
    const login = stat.author.login;
    if (!aggregated[login]) {
      aggregated[login] = {
        author: login,
        avatarUrl: stat.author.avatar_url,
        totalCommits: 0,
        totalAdditions: 0,
        totalDeletions: 0,
        totalPrs: 0,
        netLines: 0
      };
    }
    
    aggregated[login].totalCommits += stat.total;
    
    stat.weeks.forEach(week => {
      aggregated[login].totalAdditions += week.a;
      aggregated[login].totalDeletions += week.d;
    });
    
    aggregated[login].netLines = aggregated[login].totalAdditions - aggregated[login].totalDeletions;
  });

  // Process PR Stats (Map PR authors to existing contributors or add new ones if missing from commit stats)
  prs.forEach(pr => {
    const login = pr.user?.login;
    if (!login) return;

    if (!aggregated[login]) {
       // If user exists in PRs but not in commit stats (e.g. squash merges, new contributors, or outside top 100)
       // We add them to the list so they are counted.
       aggregated[login] = {
         author: login,
         avatarUrl: pr.user.avatar_url,
         totalCommits: 0,
         totalAdditions: 0,
         totalDeletions: 0,
         totalPrs: 0,
         netLines: 0
       };
    }
    
    aggregated[login].totalPrs += 1;
  });

  // Calculate Impact Score for Sorting
  // Score = (Commits * 2) + (PRs * 5) + (Capped Lines Changed / 100)
  // We cap lines changed contribution to score to prevent a single large asset commit from dominating.
  const getScore = (s: AggregatedStats) => {
    const linesImpact = Math.min(s.totalAdditions + s.totalDeletions, 100000) / 100;
    return (s.totalCommits * 2) + (s.totalPrs * 5) + linesImpact;
  };

  const sortedStats = Object.values(aggregated).sort((a, b) => getScore(b) - getScore(a));

  return {
    repoName: repo,
    owner,
    stats: sortedStats,
    totalCommits: sortedStats.reduce((acc, curr) => acc + curr.totalCommits, 0),
    totalLinesChanged: sortedStats.reduce((acc, curr) => acc + curr.totalAdditions + curr.totalDeletions, 0),
    prCount: prs.length
  };
};