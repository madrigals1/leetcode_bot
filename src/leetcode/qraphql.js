export const GET_USER_PROFILE = (username) => ({
  operationName: 'getUserProfile',
  query: `
    query getUserProfile($username: String!) {
      allQuestionsCount {
        count
        __typename
      }
      matchedUser(username: $username) {
        contributions {
          points
          __typename
        }
        profile {
          company
          countryName
          realName
          userAvatar
          __typename
        }
        submitStats {
          totalSubmissionNum {
            submissions
            __typename
          }
          acSubmissionNum {
            count
            __typename
          }
          __typename
        }
        __typename
      }
    }
  `,
  variables: {
    username,
  },
});

export const GET_RECENT_SUBMISSION_LIST = (username) => ({
  operationName: 'getRecentSubmissionList',
  query: `
    query getRecentSubmissionList($username: String!, $limit: Int) {
      recentSubmissionList(username: $username, limit: $limit) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
        __typename
      }
    }
  `,
  variables: {
    username,
  },
});

export const GET_CONTEST_RANKING_DATA = (username) => ({
  operationName: 'getContestRankingData',
  query: `
    query getContestRankingData($username: String!) {
      userContestRanking(username: $username) {
        rating
        __typename
      }
    }
  `,
  variables: {
    username,
  },
});
