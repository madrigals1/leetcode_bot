export interface ContestNode {
  startTime: number;
  title: string;
}

export interface UserContestRankingNode {
  attendedContestsCount: number;
  globalRanking: number;
  rating: number;
}

export interface UserContestRankingHistoryNode {
  contest: ContestNode;
  ranking: number;
  rating: number;
}

export interface Contest {
  userContestRanking: UserContestRankingNode;
  userContestRankingHistory: UserContestRankingHistoryNode[];
}
