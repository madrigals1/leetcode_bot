import axios from 'axios';
import moment from 'moment';

import constants from '../utils/constants';
import { log } from '../utils/helper';

import { getLeetcodeUsernameLink, getLeetcodeProblemLink } from './utils';
import {
  GET_USER_PROFILE, GET_RECENT_SUBMISSION_LIST, GET_CONTEST_RANKING_DATA,
} from './qraphql';

const getLeetcodeDataFromUsername = async (username, csrfToken) => {
  const graphQLLink = `${constants.LEETCODE_URL}/graphql`;

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
  const { profile, submitStats, contributions } = matchedUser;

  // Get realName and avatar from profile
  const { realName } = profile;

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
      link: getLeetcodeProblemLink(titleSlug),
      status: constants.STATUS_MAP[statusDisplay],
      language: lang,
      name: title,
      time: moment
        .duration(moment.unix(timestamp) - now)
        .humanize(true),
    };
  });

  // Get GraphQL from 'getContestRankingData'
  const contestQuery = GET_CONTEST_RANKING_DATA(username);
  const contestData = await axios
    .post(
      graphQLLink,
      contestQuery,
      { headers: graphQLHeaders },
    )
    .then((graphQLResponse) => {
      const { data } = graphQLResponse.data;
      return data;
    });

  return {
    name: realName,
    link: getLeetcodeUsernameLink(username),
    username,
    solved: acSubmissionNum[0].count,
    all: allQuestionsCount[0].count,
    profile,
    contributions,
    contestData,
    submitStats,
    submissions,
  };
};

export default getLeetcodeDataFromUsername;
