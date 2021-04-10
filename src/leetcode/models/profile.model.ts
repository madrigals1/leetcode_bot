interface AllQuestionsNode {
  difficulty: string;
  count: number;
}

interface UserBadgeNode {
  creationDate: string;
  displayName: string;
  icon: string;
  id: string;
}

interface BadgeNode {
  icon: string;
  name: string;
}

interface UserContributionNode {
  points: number;
  questionCount: number;
  testcaseCount: number;
}

interface SubmissionsCountNode {
  count: number;
  difficulty: string;
  submissions: number;
}

interface UserSubmitStatsNode {
  acSubmissionNum: SubmissionsCountNode[];
  totalSubmissionNum: SubmissionsCountNode[];
}

interface UserProfileNode {
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

interface UserNode {
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