import * as _ from 'lodash';

import { ButtonOptions, Context, ChatbotProvider } from '../../chatbots/models';
import { VizapiResponse } from '../../vizapi/models';
import { LanguageProblemCount, User } from '../../leetcode/models';
import { generateString } from '../../utils/helper';
import {
  ErrorMessages,
  SmallMessages,
  UserMessages,
} from '../../globals/messages';

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
  user: User,
): Promise<VizapiResponse> {
  if (!user.submitStats) {
    const error = 'placeholder';

    return {
      error,
      reason: ErrorMessages.server,
    };
  }

  if (user.submitStats.acSubmissionNum.length === 0) {
    return {
      error: UserMessages.noSubmissions(user.username),
      reason: SmallMessages.noSubmissionsKey,
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
  action: string, _users: User[],
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

export function generateMockContext(): Context {
  return {
    text: 'random_text',
    reply: () => new Promise(() => ('asd')),
    argumentParser: () => undefined,
    provider: ChatbotProvider.Mockbot,
    prefix: '/',
  };
}

export async function mockLanguageStats(
  username: string,
): Promise<LanguageProblemCount[]> {
  return new Promise((resolve) => {
    if (username === user1.username) {
      resolve([
        {
          languageName: 'C++',
          problemsSolved: 421,
        },
        {
          languageName: 'Python',
          problemsSolved: 200,
        },
        {
          languageName: 'JavaScript',
          problemsSolved: 127,
        },
      ]);
    }

    if (username === user2.username) {
      resolve([
        {
          languageName: 'TypeScript',
          problemsSolved: 10,
        },
        {
          languageName: 'C#',
          problemsSolved: 5,
        },
      ]);
    }
  });
}
