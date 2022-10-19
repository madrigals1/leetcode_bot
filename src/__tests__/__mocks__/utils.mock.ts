import { VizapiResponse } from '../../vizapi/models';
import { User } from '../../leetcode/models';
import {
  ErrorMessages,
  SmallMessages,
  UserMessages,
} from '../../globals/messages';
import { ButtonOptions, ChatbotProvider, Context } from '../../chatbots/models';

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

export function mockButtonOptions(
  action: string, _users: User[],
): ButtonOptions {
  return { action, users: _users };
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
