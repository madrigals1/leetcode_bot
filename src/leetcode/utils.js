import constants from '../utils/constants';

export function getLeetcodeUsernameLink(username) {
  return `${constants.LEETCODE_URL}/${username}`;
}

export function getLeetcodeProblemLink(title) {
  return `${constants.LEETCODE_URL}/problems/${title}`;
}
