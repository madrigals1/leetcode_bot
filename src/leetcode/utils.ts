import constants from '../utils/constants';

const { LEETCODE_URL } = constants.SYSTEM;

export function getLeetcodeUsernameLink(username: string): string {
  return `${LEETCODE_URL}/${username}`;
}

export function getLeetcodeProblemLink(title: string): string {
  return `${LEETCODE_URL}/problems/${title}`;
}
