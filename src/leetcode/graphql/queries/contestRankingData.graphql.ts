import { GraphQLQuery } from '../../models';

export default function contestRankingGraphQLQuery(
  username: string,
): GraphQLQuery {
  return {
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
}
