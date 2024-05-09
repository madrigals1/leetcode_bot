export enum KontestStatus {
  Coding = 'CODING',
  Before = 'BEFORE',
}

export enum KontestSite {
  HackerRank = 'HackerRank',
  HackerEarth = 'HackerEarth',
  CodeForces = 'CodeForces',
  CodeChef = 'CodeChef',
  AtCoder = 'AtCoder',
  LeetCode = 'LeetCode',
  KickStart = 'KickStart',
  TopCoder = 'TopCoder',
}

export interface KontestContest {
  id?: number;
  url?: string;
  name: string;
  contest_url: string;
  start_time: string;
  end_time: string;
  duration: string;
  site: KontestSite;
  in_24_hours: string;
  status: KontestStatus;
  created_at?: string;
  updated_at?: string;
}

export interface KontestKey {
  startTime: string;
  site: KontestSite;
}
