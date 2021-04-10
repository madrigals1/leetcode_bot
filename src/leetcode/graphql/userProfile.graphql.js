export default function GET_USER_PROFILE(username) {
  return {
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
}
