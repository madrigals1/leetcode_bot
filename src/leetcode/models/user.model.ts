import {
  UserProfileNode, UserContributionNode, UserSubmitStatsNode,
} from './profile.model';
import { Contest } from './contest.model';
import { SubmissionData } from './submissionData.model';

export interface UserComputedData {
  submissions?: SubmissionData[];
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
  computed?: UserComputedData;
}
