export interface AllQuestionsNode {
  difficulty: string;
  count: number;
}

export interface UserBadgeNode {
  creationDate: string;
  displayName: string;
  icon: string;
  id: string;
}

export interface BadgeNode {
  icon: string;
  name: string;
}

export interface UserContributionNode {
  points: number;
  questionCount: number;
  testcaseCount: number;
}

export interface SubmissionsCountNode {
  count: number;
  difficulty: string;
  submissions: number;
}

export interface UserSubmitStatsNode {
  acSubmissionNum: SubmissionsCountNode[];
  totalSubmissionNum: SubmissionsCountNode[];
}

export interface UserProfileNode {
  aboutMe: string;
  company: string;
  coutryName: string;
  ranking: number;
  realName: string;
  reputation: number;
  school: string;
  skillTags: string[];
  starRating: number;
  userAvatar: string;
  websites: string[];
}

export interface UserNode {
  activeBadge: UserBadgeNode;
  badges: UserBadgeNode[];
  contributions: UserContributionNode[];
  githubUrl: string;
  profile: UserProfileNode;
  socialAccounts: string[];
  submissionsCalendar: string;
  submitStats: UserSubmitStatsNode;
  upcomingBadges: BadgeNode[];
  username: string;
}

export interface UserProfile {
  allQuestionsCount: AllQuestionsNode[];
  matchedUser: UserNode;
}
