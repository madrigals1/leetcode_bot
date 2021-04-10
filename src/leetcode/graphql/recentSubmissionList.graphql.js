export default function GET_RECENT_SUBMISSION_LIST(username) {
  return {
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
  };
}
