import { VizapiResponse } from '../../vizapi/models';
import { LanguageStats, User } from '../../leetcode/models';
import { generateString } from '../../utils/helper';
import ArgumentManager from '../../chatbots/argumentManager';
import { ChatbotProvider } from '../../chatbots';

import { users, user1, user2 } from './data.mock';

export async function mockGetLeetcodeDataFromUsername(
  username: string,
): Promise<User> {
  return new Promise((resolve) => {
    const foundUser = users.find((user) => user.username === username);
    resolve(foundUser || { exists: false });
  });
}

export async function mockTableForSubmissions(
  user?: User,
): Promise<VizapiResponse> {
  if (!user?.submitStats) {
    return {
      error: 'placeholder',
      reason: '❗ Error on the server: placehoder',
    };
  }

  if (user.submitStats.acSubmissionNum.length === 0) {
    return {
      error: `❗ User <b>${user.username}</b> does not have any submissions`,
      reason: 'no_submissions',
    };
  }

  return new Promise((resolve) => {
    resolve({ link: 'http://random_link' });
  });
}

export async function mockCompareMenu(
  leftUser: User,
  rightUser: User,
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

export async function mockProblemsChart(user: User): Promise<VizapiResponse> {
  if (!user.name) {
    return {
      error: 'placeholder',
      reason: 'placeholder',
    };
  }

  return new Promise((resolve) => {
    resolve({ link: 'http://random_link_compare' });
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function mockRatingGraph(u: User[]): Promise<VizapiResponse> {
  return new Promise((resolve) => {
    resolve({ link: 'some_random_link' });
  });
}

export function mockButtonOptions(
  action: string,
  _users: User[],
): ButtonOptions {
  return { action, users: _users };
}

export function mockUserWithSolved(
  easySolved = 30,
  mediumSolved = 20,
  hardSolved = 10,
  username = generateString(10),
): User {
  const newUser = _.cloneDeep(user1);

  newUser.username = username;

  const acSubmissionNum = [
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
      count: easySolved + mediumSolved + hardSolved,
      difficulty: 'All',
      submissions: 600,
    },
  ];

  if (!newUser.submitStats) {
    newUser.submitStats = {
      totalSubmissionNum: [],
      acSubmissionNum,
    };
  } else {
    newUser.submitStats.acSubmissionNum = acSubmissionNum;
  }

  return newUser;
}

export function generateMockContext(): Context {
  return {
    text: 'random_text',
    reply: () => Promise.resolve('asd'),
    argumentParser: () => new ArgumentManager(),
    provider: ChatbotProvider.Mockbot,
    prefix: '/',
  };
}
