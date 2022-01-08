import * as _ from 'lodash';

import { VizapiResponse, ButtonOptions, Context } from '../../chatbots/models';
import { User } from '../../leetcode/models';
import dictionary from '../../utils/dictionary';
import { generateString } from '../../utils/helper';

import { users, user1 } from './data.mock';

const { SERVER_MESSAGES: SM, BOT_MESSAGES: BM } = dictionary;

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
): Promise<VizapiResponse> {
  if (!user.submitStats) {
    const error = 'placeholder';

    return {
      error,
      reason: SM.ERROR_ON_THE_SERVER(error),
    };
  }

  if (user.submitStats.acSubmissionNum.length === 0) {
    return {
      error: BM.USER_NO_SUBMISSIONS(user.username),
      reason: SM.NO_SUBMISSIONS,
    };
  }

  return new Promise((resolve) => {
    resolve({ link: 'http://random_link' });
  });
}

export async function mockCompareMenu(
  leftUser: User, rightUser: User,
): Promise<VizapiResponse> {
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

export function mockContext(): Context {
  return {
    text: 'random_text',
    reply: () => new Promise(() => ('asd')),
    argumentParser: () => undefined,
    provider: 'mockbot',
    prefix: '/',
  };
}
