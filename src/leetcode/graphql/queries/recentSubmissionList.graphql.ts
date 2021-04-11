import { GraphQLQuery } from '../../models';

export default function recentSubmissionListGraphQLQuery(
  username: string,
): GraphQLQuery {
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
        languageList {
          id
          name
          verboseName
          __typename
        }
      }
    `,
    variables: {
      username,
    },
  };
}
