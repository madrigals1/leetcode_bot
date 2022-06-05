import Mockbot from '../__mocks__/chatbots/mockbot';
import { mockTableForSubmissions } from '../__mocks__/utils.mock';
import { constants } from '../../globals/constants';
import { vizapiActions } from '../../chatbots/actions';
import { tableForSubmissions, compareMenu, ratingGraph } from '../../vizapi';
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
import ApiService from '../../backend/apiService';
import Cache from '../../backend/cache';

const mockbot = new Mockbot();

const leetcodeUsername1 = 'hello';
const leetcodeUsername2 = 'jesus';
const notExistingUsername = 'not-existing-username';

beforeAll(async () => {
  await Cache.preload();

  let channelId: number = await ApiService
    .findChannelByKey(mockbot.channelKey)
    .then((channel) => channel?.id)
    .catch(() => null);

  if (!channelId) {
    channelId = await ApiService
      .createChannel(mockbot.channelKey)
      .then((channel) => channel?.id);
  }

  mockbot.channelId = channelId;
}, 30000);

beforeEach(async () => {
  mockbot.clear();

  const fakeChannelId = mockbot.channelId
    ? mockbot.channelId
    : await ApiService
      .findChannelByKey(mockbot.channelKey)
      .then((channel) => channel.id);

  if (fakeChannelId) {
    await ApiService.clearChannel(fakeChannelId);
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
    await mockbot.send(`/add ${leetcodeUsername1} ${leetcodeUsername2}`);

    // Cache should have 2 users
    const userCount = await ApiService.userCountForChannel(mockbot.channelId);
    expect(userCount).toBe(2);

    // Both usernames should be added
    const msg1 = UserAddMessages.success(leetcodeUsername1);
    const msg2 = UserAddMessages.success(leetcodeUsername2);
    expect(mockbot.lastMessage()).toEqual(`User List:\n${msg1}\n${msg2}`);
  });

  test('Incorrect case - Existing username', async () => {
    // Add username
    await mockbot.send(`/add ${leetcodeUsername1}`);

    // Username should be added
    const msg1 = UserAddMessages.success(leetcodeUsername1);
    expect(mockbot.lastMessage()).toEqual(`User List:\n${msg1}`);

    // Add same username again
    await mockbot.send(`/add ${leetcodeUsername1}`);

    // Username should already exist
    const msg2 = UserAddMessages.alreadyExists(leetcodeUsername1);
    expect(mockbot.lastMessage()).toEqual(`User List:\n${msg2}`);
  });

  test('Incorrect case - User not found in Leetcode', async () => {
    // Add incorrect username
    await mockbot.send(`/add ${notExistingUsername}`);

    // Generate message
    const message = UserAddMessages
      .leetcodeNotFoundUsername(notExistingUsername);

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
    await mockbot.send(`/add ${leetcodeUsername1}`);

    await mockbot.send(`/remove ${leetcodeUsername1}`, true);
    const messages = mockbot.messages(2);

    expect(messages[0]).toBe(UserDeleteMessages.willBeDeleted('hello'));
    expect(messages[1]).toBe(UserDeleteMessages.success('hello'));
  });

  test('Incorrect case - Username does not exist', async () => {
    await mockbot.send(`/remove ${leetcodeUsername1}`, true);
    expect(mockbot.lastMessage())
      .toBe(UserMessages.doesNotExist(leetcodeUsername1));
  });

  test('Incorrect case - Not admin', async () => {
    await mockbot.send(`/remove ${leetcodeUsername1}`, false);
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
    await mockbot.send(`/add ${leetcodeUsername1} ${leetcodeUsername2}`);

    const userCountBeforeClear = await ApiService
      .userCountForChannel(mockbot.channelId);
    expect(userCountBeforeClear).toBe(2);

    await mockbot.send('/clear', true);

    const messages = mockbot.messages(2);

    expect(messages[0]).toEqual(ClearMessages.channelWillBeCleared);
    expect(messages[1]).toEqual(ClearMessages.channelWasCleared);

    const userCountAfterClear = await ApiService
      .userCountForChannel(mockbot.channelId);
    expect(userCountAfterClear).toBe(0);
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
    await mockbot.send(`/add ${leetcodeUsername1} ${leetcodeUsername2}`);

    await mockbot.send('/stats', true);

    const sortedUsers = await ApiService
      .fetchUsersForChannel(mockbot.channelId)
      .then((lbbUsers) => lbbUsers.map((user) => user.data));

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
    await mockbot.send(`/add ${leetcodeUsername1} ${leetcodeUsername2}`);

    const userCount = await ApiService
      .userCountForChannel(mockbot.channelId);
    expect(userCount).toBe(2);

    // Test regular rating with correct arguments
    await mockbot.send('/rating');

    const sortedUsers = await ApiService
      .fetchUsersForChannel(mockbot.channelId)
      .then((lbbUsers) => lbbUsers.map((user) => user.data));

    // TODO: Re-add this
    const message = BigMessages.ratingText(sortedUsers);
    expect(mockbot.lastMessage()).toEqual(message);
  });

  test('Correct case - Cumulative rating', async () => {
    await mockbot.send('/rating cml');

    const cmlUsers = await ApiService
      .fetchUsersForChannel(mockbot.channelId, '-solved_cml')
      .then((lbbUsers) => lbbUsers.map((user) => user.data));

    expect(mockbot.lastMessage())
      .toEqual(BigMessages.cmlRatingText(cmlUsers));
  });

  test('Correct case - Graph rating', async () => {
    vizapiActions.ratingGraph = async () => ({ link: 'some_random_link' });

    await mockbot.send('/rating graph');
    expect(mockbot.lastMessage()).toEqual(RatingMessages.graphRating);
    // TODO: Test buttons

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vizapiActions.ratingGraph = async () => ({ link: null });

    await mockbot.send('/rating graph');
    expect(mockbot.lastMessage()).toEqual(ErrorMessages.server);
  });

  // TODO: Test with 10 users

  test('Incorrect case - Incorrect rating type', async () => {
    await mockbot.send('/rating asd');
    expect(mockbot.lastMessage()).toEqual(RatingMessages.incorrectRatingType);
  });

  test('Incorrect case - No users', async () => {
    vizapiActions.ratingGraph = async () => ({ link: 'some_random_link' });

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
    await mockbot.send(`/add ${leetcodeUsername1}`);
    await mockbot.send(`/profile ${leetcodeUsername1}`);

    const user = await ApiService
      .findUserInChannel(mockbot.channelId, leetcodeUsername1)
      .then((lbbUser) => lbbUser.data);
    expect(mockbot.lastMessage()).toEqual(BigMessages.userText(user));
  });

  test('Incorrect case - Username not found', async () => {
    await mockbot.send(`/profile ${notExistingUsername}`);
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.doesNotExist(notExistingUsername));
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
    await mockbot.send(`/add ${leetcodeUsername1}`);
    await mockbot.send(`/avatar ${leetcodeUsername1}`);

    const user = await ApiService
      .findUserInChannel(mockbot.channelId, leetcodeUsername1)
      .then((lbbUser) => lbbUser.data);

    expect(mockbot.context.photoUrl).toEqual(user.profile.userAvatar);
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.usernamesAvatar(leetcodeUsername1));
  });

  test('Incorrect case - Username not found', async () => {
    await mockbot.send(`/avatar ${notExistingUsername}`);
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.doesNotExist(notExistingUsername));
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

    await mockbot.send(`/add ${leetcodeUsername2}`);
    await mockbot.send(`/submissions ${leetcodeUsername2}`);

    expect(mockbot.context.photoUrl).toEqual('http://random_link');
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.recentSubmissions(leetcodeUsername2));
  });

  test('Incorrect case - Username not found', async () => {
    await mockbot.send(`/submissions ${notExistingUsername}`);
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.doesNotExist(notExistingUsername));
  });

  test('Incorrect case - User has no submissions', async () => {
    await mockbot.send(`/add ${leetcodeUsername1}`);
    vizapiActions.tableForSubmissions = mockTableForSubmissions;

    const user = await ApiService
      .findUserInChannel(mockbot.channelId, leetcodeUsername1);
    user.data.submitStats.acSubmissionNum = [];

    // Save original method
    const { findUserInChannel } = ApiService;

    ApiService.findUserInChannel = async () => (user);

    await mockbot.send(`/add ${leetcodeUsername1}`);
    await mockbot.send(`/submissions ${leetcodeUsername1}`);

    expect(mockbot.lastMessage())
      .toEqual(UserMessages.noSubmissions(leetcodeUsername1));

    // Bring back original method
    ApiService.findUserInChannel = findUserInChannel;
  });

  test('Incorrect case - Error on the server', async () => {
    vizapiActions.tableForSubmissions = async () => ({
      error: 'placeholder',
      reason: ErrorMessages.server,
    });

    await mockbot.send(`/add ${leetcodeUsername1}`);
    await mockbot.send(`/submissions ${leetcodeUsername1}`);

    expect(mockbot.lastMessage()).toEqual(ErrorMessages.server);
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/submissions asd asd');
    expect(mockbot.lastMessage()).toEqual(ErrorMessages.server);
  });
});

describe('chatbots.actions - problems action', () => {
  test('Correct case - All users', async () => {
    await mockbot.send('/problems');
    expect(mockbot.lastMessage()).toEqual(ListMessages.userListProblems);
  });

  test('Correct case - Single user', async () => {
    await mockbot.send(`/add ${leetcodeUsername1}`);
    await mockbot.send(`/problems ${leetcodeUsername1}`);
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.solvedProblemsChart(leetcodeUsername1));
  });

  test('Incorrect case - Username not found', async () => {
    await mockbot.send(`/problems ${notExistingUsername}`);
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.doesNotExist(notExistingUsername));
  });

  test('Incorrect case - Error on the server', async () => {
    vizapiActions.solvedProblemsChart = async () => ({
      error: 'placeholder',
      reason: ErrorMessages.server,
    });

    await mockbot.send(`/add ${leetcodeUsername1}`);
    await mockbot.send(`/problems ${leetcodeUsername1}`);
    expect(mockbot.lastMessage()).toEqual(ErrorMessages.server);
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
    await mockbot.send(`/compare ${leetcodeUsername1}`);
    expect(mockbot.lastMessage()).toEqual(UserMessages.selectRightUser);
  });

  test('Correct case - Both users picked', async () => {
    vizapiActions.compareMenu = async () => (
      { link: 'http://random_link_compare' }
    );

    await mockbot.send(`/add ${leetcodeUsername1} ${leetcodeUsername2}`);
    await mockbot.send(`/compare ${leetcodeUsername1} ${leetcodeUsername2}`);

    expect(mockbot.context.photoUrl).toEqual('http://random_link_compare');
    const expectedMessage = UserMessages
      .compare(leetcodeUsername1, leetcodeUsername2);
    expect(mockbot.lastMessage()).toEqual(expectedMessage);
  });

  test('Incorrect case - Right user not found', async () => {
    await mockbot.send(`/add ${leetcodeUsername1}`);
    await mockbot.send(`/compare ${leetcodeUsername1} ${notExistingUsername}`);
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.doesNotExist(notExistingUsername));
  });

  test('Incorrect case - Left user not found', async () => {
    await mockbot.send(`/add ${leetcodeUsername1}`);
    await mockbot.send(`/compare ${notExistingUsername} ${leetcodeUsername1}`);
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.doesNotExist(notExistingUsername));
  });

  test('Incorrect case - Error on the server', async () => {
    vizapiActions.compareMenu = async () => ({
      error: 'placeholder',
      reason: ErrorMessages.server,
    });

    await mockbot.send(`/add ${leetcodeUsername1} ${leetcodeUsername2}`);
    await mockbot.send(`/compare ${leetcodeUsername1} ${leetcodeUsername2}`);

    expect(mockbot.lastMessage()).toEqual(ErrorMessages.server);
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
    await mockbot.send(`/add ${leetcodeUsername1} ${leetcodeUsername2}`);
    await mockbot.send(`/langstats ${leetcodeUsername1}`);

    const lpc1 = await ApiService
      .findUserInChannel(mockbot.channelId, leetcodeUsername1)
      .then((lbbUser) => lbbUser.data.languageStats);

    expect(mockbot.lastMessage())
      .toEqual(BigMessages.languageStatsText(leetcodeUsername1, lpc1));

    await mockbot.send(`/langstats ${leetcodeUsername2}`);

    const lpc2 = await ApiService
      .findUserInChannel(mockbot.channelId, leetcodeUsername2)
      .then((lbbUser) => lbbUser.data.languageStats);

    expect(mockbot.lastMessage())
      .toEqual(BigMessages.languageStatsText(leetcodeUsername2, lpc2));
  });

  test('Incorrect case - Username not found', async () => {
    await mockbot.send(`/langstats ${notExistingUsername}`);
    expect(mockbot.lastMessage())
      .toEqual(UserMessages.doesNotExist(notExistingUsername));
  });
});
