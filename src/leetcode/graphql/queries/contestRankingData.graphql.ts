import { GraphQLContext, GraphQLQuery } from '../../models';
import { getGraphqlLink } from '../../utils';

export function getContestRankingContext(username: string): GraphQLContext {
  const graphqlLink: string = getGraphqlLink();

  const contestRankingQuery: GraphQLQuery = {
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
  };

  return {
    link: graphqlLink,
    query: contestRankingQuery,
    headers: {},
  };
}
