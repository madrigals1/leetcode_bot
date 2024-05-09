import { GraphQLContext } from '../models';
import { getGraphqlLink } from '../utils';

export function getContestRankingContext(username: string): GraphQLContext {
  return {
    link: getGraphqlLink(),
    query: {
      operationName: 'getContestRankingData',
      query: `
        query getContestRankingData($username: String!) {
          userContestRanking(username: $username) {
            rating
          }
        }
      `,
      variables: { username },
    },
    headers: {},
  };
}

export function getRecentSubmissionListContext(
  username: string,
): GraphQLContext {
  return {
    link: getGraphqlLink(),
    query: {
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
          }
          languageList {
            id
            name
            verboseName
          }
        }
      `,
      variables: { username },
    },
    headers: {},
  };
}

export function getUserProfileContext(username: string): GraphQLContext {
  return {
    link: getGraphqlLink(),
    query: {
      operationName: 'getUserProfile',
      query: `
        query getUserProfile($username: String!) {
          allQuestionsCount {
            difficulty
            count
          }
          matchedUser(username: $username) {
            username
            socialAccounts
            githubUrl
            contributions {
              points
              questionCount
              testcaseCount
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
            }
            submissionCalendar
            submitStats {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
              totalSubmissionNum {
                difficulty
                count
                submissions
              }
            }
            badges {
              id
              displayName
              icon
              creationDate
            }
            upcomingBadges {
              name
              icon
            }
            activeBadge {
              id
            }
          }
        }
      `,
      variables: { username },
    },
    headers: {},
  };
}

export function getLanguageStatsContext(username: string): GraphQLContext {
  return {
    link: getGraphqlLink(),
    query: {
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
    },
    headers: {},
  };
}
