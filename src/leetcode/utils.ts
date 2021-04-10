import axios from 'axios';

import constants from '../utils/constants';
import dictionary from '../utils/dictionary';
import { error } from '../utils/helper';

export function getLeetcodeUsernameLink(username: string): string {
  return `${constants.LEETCODE_URL}/${username}`;
}

export function getLeetcodeProblemLink(title: string): string {
  return `${constants.LEETCODE_URL}/problems/${title}`;
}

export const getCSRFToken = new Promise((resolve, reject) => {
  axios
    .get(constants.LEETCODE_URL)
    .then((response) => {
      // Get CSRF Token from Header to use in GraphQL Responses
      const csrfTokenHeader = response.headers['set-cookie'][1];
      resolve(csrfTokenHeader.split('; ')[0].split('='));
    })
    .catch((err) => {
      error(dictionary.SERVER_MESSAGES.ERROR_ON_THE_SERVER(err));
      reject(Error("Can't get token"));
    });
});

export function getGraphQLHeaders(csrfToken: string): Record<string, string> {
  return { 'x-csrftoken': csrfToken };
}
