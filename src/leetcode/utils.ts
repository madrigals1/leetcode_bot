import constants from '../utils/constants';

export function getLeetcodeUsernameLink(username: string): string {
  return `${constants.LEETCODE_URL}/${username}`;
}

export function getLeetcodeProblemLink(title: string): string {
  return `${constants.LEETCODE_URL}/problems/${title}`;
}
