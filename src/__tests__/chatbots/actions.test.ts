import * as _ from 'lodash';

import Mockbot from '../__mocks__/chatbots/mockbot';
import { BOT_MESSAGES as BM } from '../../utils/dictionary';
import Cache from '../../cache';
import {
  mockGetLeetcodeDataFromUsername,
  mockTableForSubmissions,
  mockCompareMenu,
  mockProblemsChart,
  mockRatingGraph,
} from '../__mocks__/utils.mock';
import MockDatabaseProvider from '../__mocks__/database.mock';
import { constants } from '../../utils/constants';
import { vizapiActions } from '../../chatbots/actions';
import { tableForSubmissions, compareMenu, ratingGraph } from '../../vizapi';
import { users } from '../__mocks__/data.mock';
import { UserCache } from '../../cache/userCache';
import { User } from '../../leetcode/models';

const mockbot = new Mockbot();
const mockDatabaseProvider = new MockDatabaseProvider();
Cache.database = mockDatabaseProvider;
UserCache.getLeetcodeDataFromUsername = mockGetLeetcodeDataFromUsername;
UserCache.delayTime = 0;

const mockPassword = 'random_password';
constants.SYSTEM.MASTER_PASSWORD = mockPassword;

beforeEach(async () => {
  mockbot.clear();
  UserCache.clear();
  Cache.clearChannel(mockbot.channelKey);
  vizapiActions.tableForSubmissions = tableForSubmissions;
  vizapiActions.compareMenu = compareMenu;
  vizapiActions.ratingGraph = ratingGraph;
});

afterEach(async () => {
  mockbot.clear();
  UserCache.clear();
  Cache.clearChannel(mockbot.channelKey);
});

describe('chatbots.actions - ping action', () => {
  test('Correct case', async () => {
    await mockbot.send('/ping');
    expect(mockbot.lastMessage()).toEqual('pong');
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/ping excess_arg');
    expect(mockbot.lastMessage()).toEqual(BM.MESSAGE_SHOULD_HAVE_NO_ARGS);
  });
});

describe('chatbots.actions - start action', () => {
  test('Correct case', async () => {
    await mockbot.send('/start');
    expect(mockbot.lastMessage()).toEqual(BM.WELCOME_TEXT(mockbot.prefix));
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/start excess_arg');
    expect(mockbot.lastMessage()).toEqual(BM.MESSAGE_SHOULD_HAVE_NO_ARGS);
  });
});

describe('chatbots.actions - help action', () => {
  test('Correct case', async () => {
    await mockbot.send('/help');
    expect(mockbot.lastMessage()).toEqual(BM.HELP_TEXT);
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/help excess_arg');
    expect(mockbot.lastMessage()).toEqual(BM.MESSAGE_SHOULD_HAVE_NO_ARGS);
  });
});

describe('chatbots.actions - add action', () => {
  test('Correct case', async () => {
    // Add 2 users
    await mockbot.send('/add random_username random_username_2');

    // Cache should have 2 users
    expect(Cache.getChannel(mockbot.channelKey).userAmount).toBe(2);

    // Both usernames should be added
    const msg1 = BM.USERNAME_WAS_ADDED('random_username');
    const msg2 = BM.USERNAME_WAS_ADDED('random_username_2');
    expect(mockbot.lastMessage()).toEqual(`User List:\n${msg1}${msg2}`);
  });

  test('Incorrect case - Existing username', async () => {
    // Clear channel
    await Cache.clearChannel(mockbot.channelKey);

    // Correct username
    const username = 'random_username';

    // Add username
    await mockbot.send(`/add ${username}`);

    // Username should be added
    const msg1 = BM.USERNAME_WAS_ADDED(username);
    expect(mockbot.lastMessage()).toEqual(`User List:\n${msg1}`);

    // Add same username again
    await mockbot.send(`/add ${username}`);

    // Username should already exist
    const msg2 = BM.USERNAME_ALREADY_EXISTS(username);
    expect(mockbot.lastMessage()).toEqual(`User List:\n${msg2}`);
  });

  test('Incorrect case - User not found in Leetcode', async () => {
    // Add incorrect username
    await mockbot.send('/add incorrect_username');

    // Generate message
    const message = BM.USERNAME_NOT_FOUND_ON_LEETCODE('incorrect_username');

    // Should receive correct message
    expect(mockbot.lastMessage()).toEqual(`User List:\n${message}`);
  });

  test('Incorrect case - User limit is reached', async () => {
    // Clear channel
    await Cache.clearChannel(mockbot.channelKey);

    // Save original users from Mock LeetCode
    const originalUsers = _.clone(users);

    // Add 30 users to Mock LeetCode
    let add30message = '/add';
    for (let i = 0; i < 30; i++) {
      const fakeUser = { ...users[0], username: `fake_user_${i + 1}` };
      users.push(fakeUser);
      add30message += ` ${fakeUser.username}`;
    }

    // Add same 30 users to Channel
    await mockbot.send(add30message);

    // Add 2 extra users after reaching User limit
    await mockbot.send('/add random_username random_username_2');

    // Generate 2 messages
    const msg1 = BM.USERNAME_NOT_ADDED_USER_LIMIT('random_username', 30);
    const msg2 = BM.USERNAME_NOT_ADDED_USER_LIMIT('random_username_2', 30);

    // Should receive correct message
    expect(mockbot.lastMessage()).toEqual(`User List:\n${msg1}${msg2}`);

    // Bring back original Mock LeetCode
    users.length = 0;
    originalUsers.forEach((user) => { users.push(user); });
  });

  test('Incorrect case - Incorrect arguments', async () => {
    // Send message with excess arg
    await mockbot.send('/add');

    // Receive correct message
    expect(mockbot.lastMessage()).toEqual(BM.INSUFFICIENT_ARGS_IN_MESSAGE);
  });
});

describe('chatbots.actions - refresh action', () => {
  test('Correct case', async () => {
    await mockbot.send('/refresh');
    const messages = mockbot.messages();
    expect(messages[0]).toBe(BM.CACHE_STARTED_REFRESH);
    expect(messages[1]).toBe(BM.CACHE_IS_REFRESHED);
  });

  test('Incorrect case - Invalid arguments', async () => {
    await mockbot.send('/refresh excess_arg');
    expect(mockbot.lastMessage()).toEqual(BM.MESSAGE_SHOULD_HAVE_NO_ARGS);
  });
});

describe('chatbots.actions - remove action', () => {
  test('Correct case - Without username', async () => {
    await mockbot.send(`/remove ${mockPassword}`);
    expect(mockbot.lastMessage()).toBe(BM.USER_LIST_REMOVE);
  });

  // TODO: Check buttons

  test('Correct case - With username', async () => {
    await mockbot.send('/add random_username');

    await mockbot.send(`/remove random_username ${mockPassword}`);
    const messages = mockbot.messages(2);

    expect(messages[0]).toBe(BM.USERNAME_WILL_BE_DELETED('random_username'));
    expect(messages[1]).toBe(BM.USERNAME_WAS_DELETED('random_username'));
  });

  test('Incorrect case - Username does not exist', async () => {
    await mockbot.send(`/remove not_existing_username ${mockPassword}`);
    expect(mockbot.lastMessage())
      .toBe(BM.USERNAME_NOT_FOUND('not_existing_username'));
  });

  test('Incorrect case - Incorrect password', async () => {
    await mockbot.send('/remove blablabla incorrect_password');
    expect(mockbot.lastMessage()).toBe(BM.PASSWORD_IS_INCORRECT);
    await mockbot.send('/remove incorrect_password');
    expect(mockbot.lastMessage()).toBe(BM.PASSWORD_IS_INCORRECT);
  });

  test('Incorrect case - Not enough args', async () => {
    await mockbot.send('/remove');
    expect(mockbot.lastMessage()).toEqual(BM.PASSWORD_NOT_FOUND_IN_ARGS);
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/remove 123 123 123');
    expect(mockbot.lastMessage()).toEqual(BM.ERROR_ON_THE_SERVER);
  });
});

describe('chatbots.actions - clear action', () => {
  test('Correct case', async () => {
    await mockbot.send('/add random_username random_username_2');

    expect(Cache.getChannel(mockbot.channelKey).userAmount).toBe(2);

    await mockbot.send(`/clear ${mockPassword}`);

    const messages = mockbot.messages(2);

    expect(messages[0]).toEqual(BM.CHANNEL_WILL_BE_CLEARED);
    expect(messages[1]).toEqual(BM.CHANNEL_WAS_CLEARED);

    expect(Cache.getChannel(mockbot.channelKey).userAmount).toBe(0);
  });

  test('Incorrect case - Incorrect password', async () => {
    await mockbot.send('/clear incorrect_password');
    expect(mockbot.lastMessage()).toBe(BM.PASSWORD_IS_INCORRECT);
  });

  test('Incorrect case - Not enough args', async () => {
    await mockbot.send('/clear');
    expect(mockbot.lastMessage()).toEqual(BM.INSUFFICIENT_ARGS_IN_MESSAGE);
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/clear asd asd');
    expect(mockbot.lastMessage()).toEqual(BM.ERROR_ON_THE_SERVER);
  });
});

describe('chatbots.actions - stats action', () => {
  test('Correct case', async () => {
    // Add 2 Users
    await mockbot.send('/add random_username random_username_2');

    await mockbot.send(`/stats ${mockPassword}`);
    expect(mockbot.lastMessage())
      .toEqual(BM.STATS_TEXT(constants.PROVIDERS.MOCKBOT.ID, users));
  });

  test('Incorrect case - Incorrect password', async () => {
    await mockbot.send('/stats incorrect_password');
    expect(mockbot.lastMessage()).toBe(BM.PASSWORD_IS_INCORRECT);
  });

  test('Incorrect case - Not enough args', async () => {
    await mockbot.send('/stats');
    expect(mockbot.lastMessage()).toEqual(BM.INSUFFICIENT_ARGS_IN_MESSAGE);
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/stats asd asd');
    expect(mockbot.lastMessage()).toEqual(BM.ERROR_ON_THE_SERVER);
  });
});

describe('chatbots.actions - rating action', () => {
  test('Correct case - Regular rating', async () => {
    // Confirm that 2 users exist in Database
    await mockbot.send('/add random_username random_username_2');
    expect(Cache.getChannel(mockbot.channelKey).userAmount).toBe(2);

    // Test regular rating with correct arguments
    await mockbot.send('/rating');

    expect(mockbot.lastMessage())
      .toEqual(BM.RATING_TEXT(Cache.getChannel(mockbot.channelKey).users));
  });

  test('Correct case - Cumulative rating', async () => {
    await mockbot.send('/rating cml');

    // Predefined data
    const cmlRating = UserCache.getAllUsers().sort((user1, user2) => {
      const cml1 = user1.computed.problemsSolved.cumulative;
      const cml2 = user2.computed.problemsSolved.cumulative;
      return cml2 - cml1;
    });

    expect(mockbot.lastMessage()).toEqual(BM.CML_RATING_TEXT(cmlRating));
  });

  test('Correct case - Graph rating', async () => {
    vizapiActions.ratingGraph = mockRatingGraph;

    await mockbot.send('/rating graph');
    expect(mockbot.lastMessage()).toEqual(BM.GRAPH_RATING);
    // TODO: Test buttons

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vizapiActions.ratingGraph = (u: User[]) => new Promise((resolve) => {
      resolve({ link: null });
    });

    await mockbot.send('/rating graph');
    expect(mockbot.lastMessage()).toEqual(BM.ERROR_ON_THE_SERVER);
  });

  // TODO: Test with 10 users

  test('Incorrect case - Incorrect rating type', async () => {
    await mockbot.send('/rating asd');
    expect(mockbot.lastMessage()).toEqual(BM.INCORRECT_RATING_TYPE);
  });

  test('Incorrect case - No users', async () => {
    vizapiActions.ratingGraph = mockRatingGraph;
    await UserCache.clear();

    // Regular Rating with 0 users
    await mockbot.send('/rating');
    expect(mockbot.lastMessage()).toEqual(BM.RATING_TEXT([]));

    // CML Rating with 0 users
    await mockbot.send('/rating cml');
    expect(mockbot.lastMessage()).toEqual(BM.CML_RATING_TEXT([]));

    // CML Rating with 0 users
    await mockbot.send('/rating graph');
    expect(mockbot.lastMessage()).toEqual(BM.GRAPH_RATING);

    vizapiActions.ratingGraph = ratingGraph;
  });
});

describe('chatbots.actions - profile action', () => {
  test('Correct case - All users', async () => {
    await mockbot.send('/profile');
    expect(mockbot.lastMessage()).toEqual(BM.USER_LIST_PROFILES);
  });

  /* TODO: Test buttons */

  test('Correct case - Single user', async () => {
    await mockbot.send('/add random_username');
    await mockbot.send('/profile random_username');
    const user = UserCache.getUser('random_username');
    expect(mockbot.lastMessage()).toEqual(BM.USER_TEXT(user));
  });

  test('Incorrect case - Username not found', async () => {
    await mockbot.send('/profile not_found');
    expect(mockbot.lastMessage()).toEqual(BM.USERNAME_NOT_FOUND('not_found'));
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/profile asd asd');
    expect(mockbot.lastMessage()).toEqual(BM.ERROR_ON_THE_SERVER);
  });
});

describe('chatbots.actions - avatar action', () => {
  test('Correct case - All users', async () => {
    await mockbot.send('/avatar');
    expect(mockbot.lastMessage()).toEqual(BM.USER_LIST_AVATARS);
  });

  /* TODO: Test buttons */

  test('Correct case - Single user', async () => {
    const username = 'random_username';

    await mockbot.send(`/add ${username}`);
    await mockbot.send(`/avatar ${username}`);

    const user = UserCache.getUser(username);
    const context = mockbot.getContext();

    expect(context.photoUrl).toEqual(user.profile.userAvatar);
    expect(mockbot.lastMessage()).toEqual(BM.USER_AVATAR(username));
  });

  test('Incorrect case - Username not found', async () => {
    await mockbot.send('/avatar not_found');
    expect(mockbot.lastMessage()).toEqual(BM.USERNAME_NOT_FOUND('not_found'));
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/avatar asd asd');
    expect(mockbot.lastMessage()).toEqual(BM.ERROR_ON_THE_SERVER);
  });
});

describe('chatbots.actions - submissions action', () => {
  test('Correct case - All users', async () => {
    await mockbot.send('/submissions');
    expect(mockbot.lastMessage()).toEqual(BM.USER_LIST_SUBMISSIONS);
  });

  /* TODO: Test buttons */

  test('Correct case - Single user', async () => {
    const username = 'random_username';

    vizapiActions.tableForSubmissions = mockTableForSubmissions;

    await mockbot.send(`/add ${username}`);
    await mockbot.send(`/submissions ${username}`);

    const context = mockbot.getContext();

    expect(context.photoUrl).toEqual('http://random_link');
    expect(mockbot.lastMessage())
      .toEqual(BM.USER_RECENT_SUBMISSIONS(username));
  });

  test('Incorrect case - Username not found', async () => {
    await mockbot.send('/submissions not_found');
    expect(mockbot.lastMessage()).toEqual(BM.USERNAME_NOT_FOUND('not_found'));
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

    expect(mockbot.lastMessage()).toEqual(BM.USER_NO_SUBMISSIONS(username));
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

    expect(mockbot.lastMessage()).toEqual(BM.ERROR_ON_THE_SERVER);
    users.pop();
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/submissions asd asd');
    expect(mockbot.lastMessage()).toEqual(BM.ERROR_ON_THE_SERVER);
  });
});

describe('chatbots.actions - problems action', () => {
  test('Correct case - All users', async () => {
    await mockbot.send('/problems');
    expect(mockbot.lastMessage()).toEqual(BM.USER_LIST_PROBLEMS);
  });

  test('Correct case - Single user', async () => {
    const username = 'random_username';
    await mockbot.send(`/add ${username}`);
    await mockbot.send(`/problems ${username}`);
    expect(mockbot.lastMessage())
      .toEqual(BM.USER_SOLVED_PROBLEMS_CHART(username));
  });

  test('Incorrect case - Username not found', async () => {
    const username = 'not_found_username';
    await mockbot.send(`/problems ${username}`);
    expect(mockbot.lastMessage()).toEqual(BM.USERNAME_NOT_FOUND(username));
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
    expect(mockbot.lastMessage()).toEqual(BM.ERROR_ON_THE_SERVER);
    users.pop();
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/problems asd asd asd');
    expect(mockbot.lastMessage()).toEqual(BM.ERROR_ON_THE_SERVER);
  });
});

describe('chatbots.actions - compare action', () => {
  test('Correct case - Select left user', async () => {
    await mockbot.send('/compare');
    expect(mockbot.lastMessage()).toEqual(BM.SELECT_LEFT_USER);
  });

  /* TODO: Test buttons */

  const firstUsername = 'random_username';
  const secondUsername = 'random_username_2';

  test('Correct case - Select right user', async () => {
    await mockbot.send(`/compare ${firstUsername}`);
    expect(mockbot.lastMessage()).toEqual(BM.SELECT_RIGHT_USER);
  });

  test('Correct case - Both users picked', async () => {
    vizapiActions.compareMenu = mockCompareMenu;

    await mockbot.send(`/add ${firstUsername} ${secondUsername}`);
    await mockbot.send(`/compare ${firstUsername} ${secondUsername}`);

    const context = mockbot.getContext();

    expect(context.photoUrl).toEqual('http://random_link_compare');
    const expectedMessage = BM.USERS_COMPARE(firstUsername, secondUsername);
    expect(mockbot.lastMessage()).toEqual(expectedMessage);
  });

  test('Incorrect case - Right user not found', async () => {
    await mockbot.send(`/add ${firstUsername}`);
    await mockbot.send(`/compare ${firstUsername} not_found_1`);
    expect(mockbot.lastMessage()).toEqual(BM.USERNAME_NOT_FOUND('not_found_1'));
  });

  test('Incorrect case - Left user not found', async () => {
    await mockbot.send(`/add ${firstUsername}`);
    await mockbot.send(`/compare not_found_2 ${firstUsername}`);
    expect(mockbot.lastMessage()).toEqual(BM.USERNAME_NOT_FOUND('not_found_2'));
  });

  test('Incorrect case - Error on the server', async () => {
    vizapiActions.compareMenu = mockCompareMenu;

    const thirdUsername = 'clone_username';

    const newUser = _.cloneDeep(users[0]);
    newUser.username = thirdUsername;
    newUser.name = null;
    users.push(newUser);

    await mockbot.send(`/add ${firstUsername} ${thirdUsername}`);
    await mockbot.send(`/compare ${firstUsername} ${thirdUsername}`);

    expect(mockbot.lastMessage()).toEqual(BM.ERROR_ON_THE_SERVER);
    users.pop();
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/compare asd asd asd');
    expect(mockbot.lastMessage()).toEqual(BM.ERROR_ON_THE_SERVER);
  });
});
