import {
  UserProfileNode, UserContributionNode, UserSubmitStatsNode,
} from './profile.model';
import { Contest } from './contest.model';
import { SubmissionData } from './submissionData.model';
import { LanguageProblemCount } from './languageStats.model';

export interface UserProblemsSolvedData {
  easy: number;
  medium: number;
  hard: number;
  all: number;
  cumulative: number;
}

export interface UserComputedData {
  submissions: SubmissionData[];
  problemsSolved: UserProblemsSolvedData;
}

export interface User {
  exists: boolean;
  name?: string;
  link?: string;
  username?: string;
  solved?: number;
  all?: number;
  profile?: UserProfileNode;
  contributions?: UserContributionNode;
  contestData?: Contest;
  submitStats?: UserSubmitStatsNode;
  languageStats?: LanguageProblemCount[];
  computed?: UserComputedData;
}
