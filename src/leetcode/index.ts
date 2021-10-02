import {
  getProblemsSolved,
  getLeetcodeUsernameLink,
  getRecentSubmissions,
} from './utils';
import {
  UserProfile,
  RecentSubmissionList,
  Contest,
  User,
} from './models';
import {
  getUserProfileContext,
  getRecentSubmissionListContext,
  getContestRankingContext,
} from './graphql';
import gqlQuery from './graphql/utils';

async function getLeetcodeDataFromUsername(username: string): Promise<User> {
  // ---------------------------------------------------------------------------
  // Get all data from GraphQL
  // ---------------------------------------------------------------------------

  // Data related to User
  const userData = await gqlQuery<UserProfile>(getUserProfileContext(username));

  if (!userData.matchedUser) return { exists: false };

  // Get User Recent Submissions Data
  const submissionDataContext = getRecentSubmissionListContext(username);
  const submissionData = (
    await gqlQuery<RecentSubmissionList>(submissionDataContext)
  );

  // Get Contest Data
  const contestDataContext = getContestRankingContext(username);
  const contestData = await gqlQuery<Contest>(contestDataContext);

  // ---------------------------------------------------------------------------
  // Compute data
  // ---------------------------------------------------------------------------

  // Compute recent submissions in correct format
  const submissions = getRecentSubmissions(submissionData);

  // Compute solved problems
  const { submitStats } = userData.matchedUser;
  const problemsSolved = getProblemsSolved(submitStats.acSubmissionNum);

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
    computed: {
      submissions,
      problemsSolved,
    },
  };
}

export default getLeetcodeDataFromUsername;
