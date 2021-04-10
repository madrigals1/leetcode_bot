export default function GET_CONTEST_RANKING_DATA(username) {
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
