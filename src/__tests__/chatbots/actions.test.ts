import * as _ from 'lodash';

import Mockbot from '../__mocks__/chatbots/mockbot';
import {
  mockTableForSubmissions,
  mockCompareMenu,
  mockProblemsChart,
  mockRatingGraph,
} from '../__mocks__/utils.mock';
import { constants } from '../../globals/constants';
import { vizapiActions } from '../../chatbots/actions';
import { tableForSubmissions, compareMenu, ratingGraph } from '../../vizapi';
import { users } from '../__mocks__/data.mock';
import { User } from '../../leetcode/models';
import {
  ArgumentMessages,
  BigMessages,
  ClearMessages,
  ErrorMessages,
  ListMessages,
  RatingMessages,
  RefreshMessages,
  SmallMessages,
  UserAddMessages,
  UserDeleteMessages,
  UserMessages,
} from '../../globals/messages';
import apiService from '../../backend/apiService';

const mockbot = new Mockbot();

const realUsername1 = users[0].username;
const realUsername2 = users[1].username;
const fakeUsername = 'fake_username';

beforeEach(async () => {
  mockbot.clear();

  if (mockbot.context?.channelId) {
    await apiService.clearChannel(mockbot.context.channelId);
  }

  vizapiActions.tableForSubmissions = tableForSubmissions;
  vizapiActions.compareMenu = compareMenu;
  vizapiActions.ratingGraph = ratingGraph;
});

afterEach(async () => {
  mockbot.clear();
});

describe('chatbots.actions - ping action', () => {
  test('Correct case', async () => {
    await mockbot.send('/ping');
    expect(mockbot.lastMessage()).toEqual(SmallMessages.pong);
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/ping excess_arg');
    expect(mockbot.lastMessage())
      .toEqual(ArgumentMessages.messageShouldHaveNoArgs);
  });
});

describe('chatbots.actions - start action', () => {
  test('Correct case', async () => {
    await mockbot.send('/start');
    expect(mockbot.lastMessage())
      .toEqual(BigMessages.welcomeText(mockbot.prefix));
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/start excess_arg');
    expect(mockbot.lastMessage())
      .toEqual(ArgumentMessages.messageShouldHaveNoArgs);
  });
});

describe('chatbots.actions - help action', () => {
  test('Correct case', async () => {
    await mockbot.send('/help');
    expect(mockbot.lastMessage()).toEqual(SmallMessages.helpText);
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/help excess_arg');
    expect(mockbot.lastMessage())
      .toEqual(ArgumentMessages.messageShouldHaveNoArgs);
  });
});

describe('chatbots.actions - add action', () => {
  test('Correct case', async () => {
    // Add 2 users
    await mockbot.send(`/add ${realUsername1} ${realUsername2}`);

    // Cache should have 2 users
    // TODO: Re-add this
    // expect(Cache.getChannel(mockbot.channelKey).userAmount).toBe(2);

    // Both usernames should be added
    const msg1 = UserAddMessages.success(realUsername1);
    const msg2 = UserAddMessages.success(realUsername2);
    expect(mockbot.lastMessage()).toEqual(`User List:\n${msg1}${msg2}`);
  });

  test('Incorrect case - Existing username', async () => {
    // Clear channel
    // TODO: Re-add this
    // await Cache.clearChannel(mockbot.channelKey);

    // Add username
    await mockbot.send(`/add ${realUsername1}`);

    // Username should be added
    const msg1 = UserAddMessages.success(realUsername1);
    expect(mockbot.lastMessage()).toEqual(`User List:\n${msg1}`);

    // Add same username again
    await mockbot.send(`/add ${realUsername1}`);

    // Username should already exist
    const msg2 = UserAddMessages.alreadyExists(realUsername1);
    expect(mockbot.lastMessage()).toEqual(`User List:\n${msg2}`);
  });

  test('Incorrect case - User not found in Leetcode', async () => {
    // Add incorrect username
    await mockbot.send(`/add ${fakeUsername}`);

    // Generate message
    const message = UserAddMessages.leetcodeNotFoundUsername(fakeUsername);

    // Should receive correct message
    expect(mockbot.lastMessage()).toEqual(`User List:\n${message}`);
  });

  test('Incorrect case - Incorrect arguments', async () => {
    // Send message with excess arg
    await mockbot.send('/add');

    // Receive correct message
    expect(mockbot.lastMessage())
      .toEqual(ArgumentMessages.insufficientArgsInMessage);
  });
});

describe('chatbots.actions - refresh action', () => {
  test('Correct case', async () => {
    await mockbot.send('/refresh');
    const messages = mockbot.messages();
    expect(messages[0]).toBe(RefreshMessages.startedRefresh);
    expect(messages[1]).toBe(RefreshMessages.isRefreshed);
  });

  test('Incorrect case - Invalid arguments', async () => {
    await mockbot.send('/refresh excess_arg');
    expect(mockbot.lastMessage())
      .toEqual(ArgumentMessages.messageShouldHaveNoArgs);
  });
});

describe('chatbots.actions - remove action', () => {
  test('Correct case - Without username', async () => {
    await mockbot.send('/remove', true);
    expect(mockbot.lastMessage()).toBe(ListMessages.userListRemove);
  });

  // TODO: Check buttons

  test('Correct case - With username', async () => {
    await mockbot.send(`/add ${realUsername1}`);

    await mockbot.send(`/remove ${realUsername1}`, true);
    const messages = mockbot.messages(2);

    expect(messages[0]).toBe(UserDeleteMessages.willBeDeleted(realUsername1));
    expect(messages[1]).toBe(UserDeleteMessages.success(realUsername1));
  });

  test('Incorrect case - Username does not exist', async () => {
    await mockbot.send(`/remove ${fakeUsername}`, true);
    expect(mockbot.lastMessage()).toBe(UserMessages.doesNotExist(fakeUsername));
  });

  test('Incorrect case - Not admin', async () => {
    await mockbot.send(`/remove ${fakeUsername}`, false);
    expect(mockbot.lastMessage()).toBe(UserMessages.noAdminRights);
    await mockbot.send('/remove', false);
    expect(mockbot.lastMessage()).toBe(UserMessages.noAdminRights);
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/remove 123 123 123');
    expect(mockbot.lastMessage()).toEqual(ErrorMessages.server);
  });
});

describe('chatbots.actions - clear action', () => {
  test('Correct case', async () => {
    await mockbot.send(`/add ${realUsername1} ${realUsername2}`);

    // TODO: Re-add this
    // expect(Cache.getChannel(mockbot.channelKey).userAmount).toBe(2);

    await mockbot.send('/clear', true);

    const messages = mockbot.messages(2);

    expect(messages[0]).toEqual(ClearMessages.channelWillBeCleared);
    expect(messages[1]).toEqual(ClearMessages.channelWasCleared);

    // TODO: Re-add this
    // expect(Cache.getChannel(mockbot.channelKey).userAmount).toBe(0);
  });

  test('Incorrect case - Not admin', async () => {
    await mockbot.send('/clear');
    expect(mockbot.lastMessage()).toBe(UserMessages.noAdminRights);
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/clear asd asd');
    expect(mockbot.lastMessage())
      .toEqual(ArgumentMessages.messageShouldHaveNoArgs);
  });
});

describe('chatbots.actions - stats action', () => {
  test('Correct case', async () => {
    // Add 2 Users
    await mockbot.send(`/add ${realUsername1} ${realUsername2}`);

    await mockbot.send('/stats', true);

    const sortedUsers = [users[1], users[0]];

    const message = BigMessages
      .statsText(constants.PROVIDERS.MOCKBOT.ID, sortedUsers);
    expect(mockbot.lastMessage()).toEqual(message);
  });

  test('Incorrect case - Not admin', async () => {
    await mockbot.send('/stats', false);
    expect(mockbot.lastMessage()).toBe(UserMessages.noAdminRights);
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/stats asd asd');
    expect(mockbot.lastMessage())
      .toEqual(ArgumentMessages.messageShouldHaveNoArgs);
  });
});

describe('chatbots.actions - rating action', () => {
  test('Correct case - Regular rating', async () => {
    // Confirm that 2 users exist in Database
    await mockbot.send(`/add ${realUsername1} ${realUsername2}`);

    // TODO: Re-add this
    // expect(Cache.getChannel(mockbot.channelKey).userAmount).toBe(2);

    // Test regular rating with correct arguments
    await mockbot.send('/rating');

    // TODO: Re-add this
    // expect(mockbot.lastMessage())
    //   .toEqual(BM.RATING_TEXT(Cache.getChannel(mockbot.channelKey).users));
  });

  test('Correct case - Cumulative rating', async () => {
    await mockbot.send('/rating cml');

    // TODO: Re-add this
    // // Predefined data
    // const cmlRating = UserCache.getAllUsers().sort((user1, user2) => {
    //   const cml1 = user1.computed.problemsSolved.cumulative;
    //   const cml2 = user2.computed.problemsSolved.cumulative;
    //   return cml2 - cml1;
    // });

    // expect(mockbot.lastMessage()).toEqual(BM.CML_RATING_TEXT(cmlRating));
  });

  test('Correct case - Graph rating', async () => {
    vizapiActions.ratingGraph = mockRatingGraph;

    await mockbot.send('/rating graph');
    expect(mockbot.lastMessage()).toEqual(RatingMessages.graphRating);
    // TODO: Test buttons

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vizapiActions.ratingGraph = (u: User[]) => new Promise((resolve) => {
      resolve({ link: null });
    });

    await mockbot.send('/rating graph');
    expect(mockbot.lastMessage()).toEqual(ErrorMessages.server);
  });

  // TODO: Test with 10 users

  test('Incorrect case - Incorrect rating type', async () => {
    await mockbot.send('/rating asd');
    expect(mockbot.lastMessage()).toEqual(SmallMessages.incorrectBotType);
  });

  test('Incorrect case - No users', async () => {
    vizapiActions.ratingGraph = mockRatingGraph;

    // TODO: Re-add this
    // await UserCache.clear();

    // Regular Rating with 0 users
    await mockbot.send('/rating');
    expect(mockbot.lastMessage()).toEqual(BigMessages.ratingText([]));

    // CML Rating with 0 users
    await mockbot.send('/rating cml');
    expect(mockbot.lastMessage()).toEqual(BigMessages.cmlRatingText([]));

    // CML Rating with 0 users
    await mockbot.send('/rating graph');
    expect(mockbot.lastMessage()).toEqual(RatingMessages.graphRating);

    vizapiActions.ratingGraph = ratingGraph;
  });
});

describe('chatbots.actions - profile action', () => {
  test('Correct case - All users', async () => {
    await mockbot.send('/profile');
    expect(mockbot.lastMessage()).toEqual(ListMessages.userListProfiles);
  });

  /* TODO: Test buttons */

  test('Correct case - Single user', async () => {
    await mockbot.send(`/add ${realUsername1}`);
    await mockbot.send(`/profile ${realUsername1}`);

    // TODO: Re-add this
    // const user = UserCache.getUser(realUsername1);
    // expect(mockbot.lastMessage()).toEqual(BM.USER_TEXT(user));
  });

  test('Incorrect case - Username not found', async () => {
    await mockbot.send(`/profile ${fakeUsername}`);
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.doesNotExist(fakeUsername));
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/profile asd asd');
    expect(mockbot.lastMessage()).toEqual(ErrorMessages.server);
  });
});

describe('chatbots.actions - avatar action', () => {
  test('Correct case - All users', async () => {
    await mockbot.send('/avatar');
    expect(mockbot.lastMessage()).toEqual(ListMessages.userListAvatars);
  });

  /* TODO: Test buttons */

  test('Correct case - Single user', async () => {
    await mockbot.send(`/add ${realUsername1}`);
    await mockbot.send(`/avatar ${realUsername1}`);

    // TODO: Re-add this
    // const user = UserCache.getUser(realUsername1);
    // const context = mockbot.getContext();

    // expect(context.photoUrl).toEqual(user.profile.userAvatar);
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.usernamesAvatar(realUsername1));
  });

  test('Incorrect case - Username not found', async () => {
    await mockbot.send(`/avatar ${fakeUsername}`);
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.doesNotExist(fakeUsername));
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/avatar asd asd');
    expect(mockbot.lastMessage()).toEqual(ErrorMessages.server);
  });
});

describe('chatbots.actions - submissions action', () => {
  test('Correct case - All users', async () => {
    await mockbot.send('/submissions');
    expect(mockbot.lastMessage()).toEqual(ListMessages.userListSubmissions);
  });

  /* TODO: Test buttons */

  test('Correct case - Single user', async () => {
    vizapiActions.tableForSubmissions = mockTableForSubmissions;

    await mockbot.send(`/add ${realUsername1}`);
    await mockbot.send(`/submissions ${realUsername1}`);

    const context = mockbot.getContext();

    expect(context.photoUrl).toEqual('http://random_link');
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.recentSubmissions(realUsername1));
  });

  test('Incorrect case - Username not found', async () => {
    await mockbot.send(`/submissions ${fakeUsername}`);
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.doesNotExist(fakeUsername));
  });

  test('Incorrect case - User has no submissions', async () => {
    const username = 'clone_username';
    const newUser = _.cloneDeep(users[0]);
    newUser.username = username;
    newUser.submitStats.acSubmissionNum = [];
    users.push(newUser);

    vizapiActions.tableForSubmissions = mockTableForSubmissions;

    await mockbot.send(`/add ${username}`);
    await mockbot.send(`/submissions ${username}`);

    expect(mockbot.lastMessage()).toEqual(UserMessages.noSubmissions(username));
    users.pop();
  });

  test('Incorrect case - Error on the server', async () => {
    const username = 'clone_username_2';
    const newUser2 = _.cloneDeep(users[0]);
    newUser2.username = username;
    newUser2.submitStats = null;
    users.push(newUser2);

    vizapiActions.tableForSubmissions = mockTableForSubmissions;

    await mockbot.send(`/add ${username}`);
    await mockbot.send(`/submissions ${username}`);

    expect(mockbot.lastMessage()).toEqual(ErrorMessages.server);
    users.pop();
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/submissions asd asd');
    expect(mockbot.lastMessage()).toEqual(ErrorMessages.server);
  });
});

describe('chatbots.actions - problems action', () => {
  test('Correct case - All users', async () => {
    await mockbot.send('/problems');
    expect(mockbot.lastMessage()).toEqual(ErrorMessages.server);
  });

  test('Correct case - Single user', async () => {
    await mockbot.send(`/add ${realUsername1}`);
    await mockbot.send(`/problems ${realUsername1}`);
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.solvedProblemsChart(realUsername1));
  });

  test('Incorrect case - Username not found', async () => {
    await mockbot.send(`/problems ${fakeUsername}`);
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.doesNotExist(fakeUsername));
  });

  test('Incorrect case - Error on the server', async () => {
    vizapiActions.solvedProblemsChart = mockProblemsChart;
    const user = _.clone(users[0]);
    const username = 'new_username';
    user.username = username;
    user.name = undefined;
    users.push(user);

    await mockbot.send(`/add ${username}`);
    await mockbot.send(`/problems ${username}`);
    expect(mockbot.lastMessage()).toEqual(ErrorMessages.server);
    users.pop();
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/problems asd asd asd');
    expect(mockbot.lastMessage()).toEqual(ErrorMessages.server);
  });
});

describe('chatbots.actions - compare action', () => {
  test('Correct case - Select left user', async () => {
    await mockbot.send('/compare');
    expect(mockbot.lastMessage()).toEqual(UserMessages.selectLeftUser);
  });

  /* TODO: Test buttons */

  test('Correct case - Select right user', async () => {
    await mockbot.send(`/compare ${realUsername1}`);
    expect(mockbot.lastMessage()).toEqual(UserMessages.selectRightUser);
  });

  test('Correct case - Both users picked', async () => {
    vizapiActions.compareMenu = mockCompareMenu;

    await mockbot.send(`/add ${realUsername1} ${realUsername2}`);
    await mockbot.send(`/compare ${realUsername1} ${realUsername2}`);

    const context = mockbot.getContext();

    expect(context.photoUrl).toEqual('http://random_link_compare');
    const expectedMessage = UserMessages.compare(realUsername1, realUsername2);
    expect(mockbot.lastMessage()).toEqual(expectedMessage);
  });

  test('Incorrect case - Right user not found', async () => {
    await mockbot.send(`/add ${realUsername1}`);
    await mockbot.send(`/compare ${realUsername1} ${fakeUsername}`);
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.doesNotExist(fakeUsername));
  });

  test('Incorrect case - Left user not found', async () => {
    await mockbot.send(`/add ${realUsername1}`);
    await mockbot.send(`/compare ${fakeUsername} ${realUsername1}`);
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.doesNotExist(fakeUsername));
  });

  test('Incorrect case - Error on the server', async () => {
    vizapiActions.compareMenu = mockCompareMenu;

    const thirdUsername = 'clone_username';

    const newUser = _.cloneDeep(users[0]);
    newUser.username = thirdUsername;
    newUser.name = null;
    users.push(newUser);

    await mockbot.send(`/add ${realUsername1} ${thirdUsername}`);
    await mockbot.send(`/compare ${realUsername1} ${thirdUsername}`);

    expect(mockbot.lastMessage()).toEqual(ErrorMessages.server);
    users.pop();
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/compare asd asd asd');
    expect(mockbot.lastMessage()).toEqual(ErrorMessages.server);
  });
});

describe('chatbots.actions - langstats action', () => {
  test('Correct case - All users', async () => {
    await mockbot.send('/langstats');
    expect(mockbot.lastMessage()).toEqual(ListMessages.userListLangstats);
  });

  /* TODO: Test buttons */

  test('Correct case - Single user', async () => {
    await mockbot.send(`/add ${realUsername1} ${realUsername2}`);
    await mockbot.send(`/langstats ${realUsername1}`);

    const lpc1 = [
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
    ];

    expect(mockbot.lastMessage())
      .toEqual(BigMessages.languageStatsText(realUsername1, lpc1));

    await mockbot.send(`/langstats ${realUsername2}`);

    const lpc2 = [
      {
        languageName: 'TypeScript',
        problemsSolved: 10,
      },
      {
        languageName: 'C#',
        problemsSolved: 5,
      },
    ];

    expect(mockbot.lastMessage())
      .toEqual(BigMessages.languageStatsText(realUsername2, lpc2));
  });

  test('Incorrect case - Username not found', async () => {
    await mockbot.send(`/langstats ${fakeUsername}`);
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.doesNotExist(fakeUsername));
  });
});
