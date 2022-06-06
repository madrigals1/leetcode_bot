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
  KickStart = 'Kick Start',
  TopCoder = 'TopCoder',
}

export interface KontestContest {
  'name': string;
  'url': string;
  'start_time': string;
  'end_time': string;
  'duration': string;
  'site': KontestSite;
  'in_24_hours': string;
  'status': KontestStatus;
}

export interface KontestKey {
  startTime: string;
  site: KontestSite;
}
