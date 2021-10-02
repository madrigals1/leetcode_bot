import { GraphQLContext, GraphQLQuery } from '../../models';
import { getGraphqlLink } from '../../utils';

export function getRecentSubmissionListContext(
  username: string,
): GraphQLContext {
  const graphqlLink: string = getGraphqlLink();

  const recentSubmissionListQuery: GraphQLQuery = {
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

  return {
    link: graphqlLink,
    query: recentSubmissionListQuery,
    headers: {},
  };
}
