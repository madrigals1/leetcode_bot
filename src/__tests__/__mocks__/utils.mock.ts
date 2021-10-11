import * as _ from 'lodash';

import { TableResponse, ButtonOptions } from '../../chatbots/models';
import { User } from '../../leetcode/models';
import dictionary from '../../utils/dictionary';
import { generateString } from '../../utils/helper';

import { users, user1 } from './data.mock';

export async function mockGetLeetcodeDataFromUsername(
  username: string,
): Promise<User> {
  return new Promise((resolve) => {
    const foundUser = users.find((user) => user.username === username);
    resolve(foundUser || { exists: false });
  });
}

export async function mockTableForSubmissions(
  user: User,
): Promise<TableResponse> {
  if (!user.submitStats) {
    const error = 'placeholder';

    return {
      error,
      reason: dictionary.SERVER_MESSAGES.ERROR_ON_THE_SERVER(error),
    };
  }

  if (user.submitStats.acSubmissionNum.length === 0) {
    return {
      error: dictionary.BOT_MESSAGES.USER_NO_SUBMISSIONS(user.username),
      reason: dictionary.SERVER_MESSAGES.NO_SUBMISSIONS,
    };
  }

  return new Promise((resolve) => {
    resolve({ link: 'http://random_link' });
  });
}

export async function mockCompareMenu(
  leftUser: User, rightUser: User,
): Promise<TableResponse> {
  if (!leftUser.name || !rightUser.name) {
    return {
      error: 'placeholder',
      reason: 'placeholder',
    };
  }

  return new Promise((resolve) => {
    resolve({ link: 'http://random_link_compare' });
  });
}

export function mockButtonOptions(
  action: string, password?: string,
): ButtonOptions {
  return { action, password };
}

export function mockUserWithSolved(
  easySolved = 30,
  mediumSolved = 20,
  hardSolved = 10,
  username = generateString(10),
): User {
  const newUser = _.cloneDeep(user1);

  newUser.username = username;
  newUser.submitStats.acSubmissionNum = [
    {
      count: easySolved,
      difficulty: 'Easy',
      submissions: 100,
    },
    {
      count: mediumSolved,
      difficulty: 'Medium',
      submissions: 200,
    },
    {
      count: hardSolved,
      difficulty: 'Hard',
      submissions: 300,
    },
    {
      count: 600,
      difficulty: 'All',
      submissions: 600,
    },
  ];

  return newUser;
}
