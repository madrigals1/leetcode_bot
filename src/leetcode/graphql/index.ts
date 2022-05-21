import { GraphQLContext, GraphQLQuery } from '../models';
import { getGraphqlLink } from '../utils';

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
          time
          statusDisplay
          lang
          memory
          runtime
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

export function getUserProfileContext(username: string): GraphQLContext {
  const graphqlLink: string = getGraphqlLink();

  const userProfileQuery: GraphQLQuery = {
    operationName: 'getUserProfile',
    query: `
      query getUserProfile($username: String!) {
        allQuestionsCount {
          difficulty
          count
          __typename
        }
        matchedUser(username: $username) {
          username
          socialAccounts
          githubUrl
          contributions {
            points
            questionCount
            testcaseCount
            __typename
          }
          profile {
            realName
            websites
            countryName
            skillTags
            company
            school
            starRating
            aboutMe
            userAvatar
            reputation
            ranking
            __typename
          }
          submissionCalendar
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
              __typename
            }
            totalSubmissionNum {
              difficulty
              count
              submissions
              __typename
            }
            __typename
          }
          badges {
            id
            displayName
            icon
            creationDate
            __typename
          }
          upcomingBadges {
            name
            icon
            __typename
          }
          activeBadge {
            id
            __typename
          }    __typename
        }
      }
    `,
    variables: {
      username,
    },
  };

  return {
    link: graphqlLink,
    query: userProfileQuery,
    headers: {},
  };
}

export function getLanguageStatsContext(username: string): GraphQLContext {
  const graphqlLink: string = getGraphqlLink();
  const languageStatsQuery: GraphQLQuery = {
    query: `
      query languageStats($username: String!) {
        matchedUser(username: $username) {
          languageProblemCount {
            languageName
            problemsSolved
          }
        }
      }
    `,
    variables: { username },
  };

  return {
    link: graphqlLink,
    query: languageStatsQuery,
    headers: {},
  };
}
