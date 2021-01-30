import axios from 'axios';
import moment from 'moment';

import constants from '../utils/constants';
import dictionary from '../utils/dictionary';
import { error, log } from '../utils/helper';

import { GET_USER_PROFILE, GET_RECENT_SUBMISSION_LIST } from './qraphql';

// Save CSRF_TOKEN as constant to reuse in future
let CSRF_TOKEN = null;

const getCSRFToken = async () => {
  // If CSRF_TOKEN was already set, return it
  if (CSRF_TOKEN) return CSRF_TOKEN;

  // If CSRF_TOKEN was not already set, retrieve it
  return axios
    .get(constants.LEETCODE_URL)
    .then((response) => {
      // Get CSRF Token from Header to use in GraphQL Responses
      const csrfTokenHeader = response.headers['set-cookie'][1];
      [, CSRF_TOKEN] = csrfTokenHeader.split('; ')[0].split('=');

      return CSRF_TOKEN;
    })
    .catch((err) => {
      error(dictionary.SERVER_MESSAGES.ERROR_ON_THE_SERVER(err));
      return null;
    });
};

const getLeetcodeDataFromUsername = async (username) => {
  const graphQLLink = `${constants.LEETCODE_URL}/graphql`;

  // Get saved csrfToken or retrieve new one
  const csrfToken = await getCSRFToken();
  // Set GraphQL Headers
  const graphQLHeaders = { 'x-csrftoken': csrfToken };

  // Get GraphQL from 'getUserProfile'
  const userGraphQLdata = GET_USER_PROFILE(username);
  const userData = await axios
    .post(graphQLLink, userGraphQLdata, { headers: graphQLHeaders })
    .then((graphQLResponse) => graphQLResponse.data.data)
    .catch((err) => log(err));
  const { matchedUser, allQuestionsCount } = userData;

  // If user was not found on LeetCode, return null
  if (!matchedUser) return null;

  // Get profile and submitStats from matchedUser
  const { profile, submitStats } = matchedUser;

  // Get realName and avatar from profile
  const { realName, userAvatar } = profile;

  // Get submission number from submitStats
  const { acSubmissionNum } = submitStats;

  // Get current time to make humanized times for submissions
  const now = moment();

  // Get GraphQL from 'getRecentSubmissionList'
  const recentSubmissionGraphQLdata = GET_RECENT_SUBMISSION_LIST(username);
  const userRecentSubmissionData = await axios
    .post(
      graphQLLink,
      recentSubmissionGraphQLdata,
      { headers: graphQLHeaders },
    )
    .then((graphQLResponse) => graphQLResponse.data.data);

  const { recentSubmissionList } = userRecentSubmissionData;

  const submissions = recentSubmissionList.map((submission) => {
    // Get necessary data from submission
    const {
      titleSlug, statusDisplay, lang, title, timestamp,
    } = submission;

    return {
      link: `/problems/${titleSlug}`,
      status: constants.STATUS_MAP[statusDisplay],
      language: lang,
      name: title,
      time: moment
        .duration(moment.unix(timestamp) - now)
        .humanize(true),
    };
  });

  return {
    name: realName,
    link: `${constants.LEETCODE_URL}/${username}`,
    username,
    solved: acSubmissionNum[0].count,
    all: allQuestionsCount[0].count,
    avatar: userAvatar,
    submissions,
  };
};

export default getLeetcodeDataFromUsername;
