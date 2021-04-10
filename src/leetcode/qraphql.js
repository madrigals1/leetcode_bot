export const GET_USER_PROFILE = (username) => ({
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
