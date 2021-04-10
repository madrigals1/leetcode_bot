import axios from 'axios';

import constants from '../utils/constants';
import dictionary from '../utils/dictionary';
import { error } from '../utils/helper';

export function getLeetcodeUsernameLink(username) {
  return `${constants.LEETCODE_URL}/${username}`;
}

export function getLeetcodeProblemLink(title) {
  return `${constants.LEETCODE_URL}/problems/${title}`;
}

// Save CSRF_TOKEN as constant to reuse in future
let CSRF_TOKEN = null;

export async function getCSRFToken() {
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
}
