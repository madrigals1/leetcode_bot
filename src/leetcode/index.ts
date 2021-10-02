import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import * as relativeTime from 'dayjs/plugin/relativeTime';

import constants from '../utils/constants';

import {
  UserProfile,
  GraphQLContext,
  GraphQLQuery,
  RecentSubmissionList,
  SubmissionDumpNode,
  LanguageNode,
  Contest,
  User,
  SubmissionData,
} from './models';
import { getLeetcodeUsernameLink, getLeetcodeProblemLink } from './utils';
import {
  getUserProfileContext,
  getRecentSubmissionListContext,
  getContestRankingContext,
} from './graphql';
import gqlQuery from './graphql/utils';

dayjs.extend(duration);
dayjs.extend(relativeTime);

async function getLeetcodeDataFromUsername(username: string): Promise<User> {
  // Data related to User
  const userData = await gqlQuery<UserProfile>(getUserProfileContext(username));

  if (!userData.matchedUser) return { exists: false };

  // Get User Recent Submissions Data
  const submissionDataContext = getRecentSubmissionListContext(username);
  const submissionData: RecentSubmissionList = (
    await gqlQuery<RecentSubmissionList>(submissionDataContext)
  );

  const now: number = dayjs().unix();
  const submissions: SubmissionData[] = submissionData.recentSubmissionList.map(
    (submission: SubmissionDumpNode) => {
      const unixTime: number = parseInt(submission.timestamp, 10);

      return {
        link: getLeetcodeProblemLink(submission.titleSlug),
        status: constants.SUBMISSION_STATUS_MAP[submission.statusDisplay],
        language: submissionData.languageList.find((language: LanguageNode) => (
          language.name === submission.lang
        )).verboseName,
        name: submission.title,
        time: dayjs.duration((unixTime - now) * 1000).humanize(true),
      };
    },
  );

  // Get Contest Data
  const contestDataContext = getContestRankingContext(username);
  const contestData: Contest = await gqlQuery<Contest>(contestDataContext);

  return {
    exists: true,
    name: userData.matchedUser.profile.realName,
    link: getLeetcodeUsernameLink(username),
    username,
    solved: userData.matchedUser.submitStats.acSubmissionNum[0].count,
    all: userData.allQuestionsCount[0].count,
    profile: userData.matchedUser.profile,
    contributions: userData.matchedUser.contributions,
    contestData,
    submitStats: userData.matchedUser.submitStats,
    submissions,
  };
}

export default getLeetcodeDataFromUsername;
