import * as _ from 'lodash';

import { ButtonOptions, Context } from '../../chatbots/models';
import { VizapiResponse } from '../../vizapi/models';
import { LanguageStats, User } from '../../leetcode/models';
import {
  SERVER_MESSAGES as SM, BOT_MESSAGES as BM,
} from '../../utils/dictionary';
import { generateString } from '../../utils/helper';
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

export async function moclLanguageStats(
  username: string,
): Promise<LanguageStats> {
  return new Promise((resolve) => {
    if (username === user1[0].username) {
      resolve({
        matchedUser: {
          languageProblemCount: [
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
          ],
        },
      });
    }

    if (username === user2[0].username) {
      resolve({
        matchedUser: {
          languageProblemCount: [
            {
              languageName: 'TypeScript',
              problemsSolved: 10,
            },
            {
              languageName: 'C#',
              problemsSolved: 5,
            },
          ],
        },
      });
    }
  });
}
