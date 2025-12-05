export interface ContributorStat {
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
    id: number;
  };
  total: number; // Total commits
  weeks: {
    w: number; // Start of the week (unix timestamp)
    a: number; // Additions
    d: number; // Deletions
    c: number; // Commits
  }[];
}

export interface PrStat {
  user: {
    login: string;
    avatar_url: string;
  };
  number: number;
  title: string;
  created_at: string;
  merged_at: string | null;
}

export interface AggregatedStats {
  author: string;
  avatarUrl: string;
  totalCommits: number;
  totalAdditions: number;
  totalDeletions: number;
  totalPrs: number; // Based on the sample fetched
  netLines: number;
}

export interface AnalysisResult {
  repoName: string;
  owner: string;
  stats: AggregatedStats[];
  totalCommits: number;
  totalLinesChanged: number;
  prCount: number; // Total fetched/analyzed PRs
}

export interface RepoDetails {
  owner: string;
  repo: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  FETCHING_CONTRIBUTORS = 'FETCHING_CONTRIBUTORS',
  FETCHING_PRS = 'FETCHING_PRS',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}