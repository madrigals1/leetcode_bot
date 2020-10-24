const GET_USER_PROFILE = (username) => ({
  operationName: 'getUserProfile',
  query: `
    query getUserProfile($username: String!) {
      allQuestionsCount {
        count
        __typename
      }
      matchedUser(username: $username) {
        profile {
          realName
          userAvatar
          __typename
        }
        submitStats {
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

const GET_RECENT_SUBMISSION_LIST = (username) => ({
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

module.exports = { GET_USER_PROFILE, GET_RECENT_SUBMISSION_LIST };
