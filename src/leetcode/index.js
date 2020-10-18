const axios = require('axios');
const moment = require('moment');
const { LEETCODE_URL, SUBMISSION_COUNT, STATUS_MAP } = require('../utils/constants');
const { SERVER_MESSAGES } = require('../utils/dictionary');
const { error } = require('../utils/helper');
const { GET_USER_PROFILE, GET_RECENT_SUBMISSION_LIST } = require('./qraphql');

async function getLeetcodeDataFromUsername(username) {
  const graphQLLink = `${LEETCODE_URL}/graphql`;
  return axios.get(LEETCODE_URL).then(
    async (response) => {
      // Get CSRF Token from Header to use in GraphQL Responses
      const csrfTokenHeader = response.headers['set-cookie'][1];
      const csrfToken = csrfTokenHeader.split('; ')[0].split('=')[1];

      // Get GraphQL Headers
      const graphQLHeaders = { 'x-csrftoken': csrfToken };

      // Get GraphQL from 'getUserProfile'
      const userGraphQLdata = GET_USER_PROFILE(username);
      const userData = await axios
        .post(graphQLLink, userGraphQLdata, { headers: graphQLHeaders })
        .then((graphQLResponse) => graphQLResponse.data.data);
      const userProfileData = userData.matchedUser.profile;
      const userSubmissionStatsData = userData.matchedUser.submitStats;

      // Get current time to make humanized times for submissions
      const now = moment();

      // Get GraphQL from 'getRecentSubmissionList'
      const recentSubmissionGraphQLdata = GET_RECENT_SUBMISSION_LIST(username);
      const userRecentSubmissionData = await axios
        .post(graphQLLink, recentSubmissionGraphQLdata, { headers: graphQLHeaders })
        .then((graphQLResponse) => graphQLResponse.data.data);
      const recentSubmissionList = userRecentSubmissionData
        .recentSubmissionList.slice(0, SUBMISSION_COUNT);
      const submissions = recentSubmissionList.map((submission) => ({
        link: `/problems/${submission.titleSlug}`,
        status: STATUS_MAP[submission.statusDisplay],
        language: submission.lang,
        name: submission.title,
        time: moment.duration(moment.unix(submission.timestamp) - now).humanize(true),
      }));

      return {
        name: userProfileData.realName,
        link: `${LEETCODE_URL}/${username}`,
        username,
        solved: userSubmissionStatsData.acSubmissionNum[0].count,
        all: userData.allQuestionsCount[0].count,
        avatar: userProfileData.userAvatar,
        submissions,
      };
    },
    (err) => {
      error(SERVER_MESSAGES.ERROR_ON_THE_SERVER(err));
      return null;
    },
  );
}

module.exports = { getLeetcodeDataFromUsername };
