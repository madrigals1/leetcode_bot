import * as moment from 'moment';

import constants from '../utils/constants';

import {
  UserProfile,
  GraphQLContext,
  GraphQLQuery,
  RecentSubmissionList,
  SubmissionDumpNode,
  LanguageNode,
  Contest,
} from './models';
import {
  getLeetcodeUsernameLink, getLeetcodeProblemLink, getGraphQLHeaders,
} from './utils';
import {
  userProfileGraphQLQuery,
  recentSubmissionListGraphQLQuery,
  contestRankingGraphQLQuery,
} from './graphql';
import gqlQuery from './graphql/utils';

async function getLeetcodeDataFromUsername(
  username: string, csrfToken: string,
): Promise<Record<string, unknown>> {
  // Data for GraphQL Response
  const graphQLLink = `${constants.LEETCODE_URL}/graphql`;
  const graphQLHeaders: Record<string, string> = getGraphQLHeaders(csrfToken);

  // Get User Profile Data from GraphQL
  const userProfileQuery: GraphQLQuery = userProfileGraphQLQuery(username);
  const userProfileContext: GraphQLContext = {
    link: graphQLLink,
    query: userProfileQuery,
    headers: graphQLHeaders,
  };
  const userData: UserProfile = await gqlQuery<UserProfile>(userProfileContext);

  // Get User Recent Submissions Data from GraphQL
  const submissionsQuery: GraphQLQuery = (
    recentSubmissionListGraphQLQuery(username)
  );
  const submissionContext: GraphQLContext = {
    link: graphQLLink,
    query: submissionsQuery,
    headers: graphQLHeaders,
  };
  const submissionData: RecentSubmissionList = (
    await gqlQuery<RecentSubmissionList>(submissionContext)
  );
  const now: number = moment().unix();
  const submissions = submissionData.recentSubmissionList.map(
    (submission: SubmissionDumpNode) => {
      const unixTime: number = parseInt(submission.timestamp, 10);

      return {
        link: getLeetcodeProblemLink(submission.titleSlug),
        status: constants.STATUS_MAP[submission.statusDisplay],
        language: submissionData.languageList.find((language: LanguageNode) => (
          language.name === submission.lang
        )).verboseName,
        name: submission.title,
        time: moment.duration(unixTime - now).humanize(true),
      };
    },
  );

  // Get Contest Data from GraphQL
  const contestQuery: GraphQLQuery = contestRankingGraphQLQuery(username);
  const contestContext: GraphQLContext = {
    link: graphQLLink,
    query: contestQuery,
    headers: graphQLHeaders,
  };
  const contestData: Contest = await gqlQuery<Contest>(contestContext);

  return {
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
