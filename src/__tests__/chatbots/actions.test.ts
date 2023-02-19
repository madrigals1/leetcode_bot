import * as _ from 'lodash';

import Mockbot from '../__mocks__/chatbots/mockbot';
import Cache from '../../cache';
import {
  mockGetLeetcodeDataFromUsername,
  mockTableForSubmissions,
  mockCompareMenu,
  mockProblemsChart,
  mockRatingGraph,
  mockLanguageStats,
} from '../__mocks__/utils.mock';
import MockDatabaseProvider from '../__mocks__/database.mock';
import { vizapiActions, leetcodeActions } from '../../chatbots/actions';
import { tableForSubmissions, compareMenu, ratingGraph } from '../../vizapi';
import { users } from '../__mocks__/data.mock';
import { UserCache } from '../../cache/userCache';
import { User } from '../../leetcode/models';
import { getLanguageStats } from '../../leetcode';

const mockbot = new Mockbot();
const mockDatabaseProvider = new MockDatabaseProvider();
Cache.database = mockDatabaseProvider;
UserCache.getLeetcodeDataFromUsername = mockGetLeetcodeDataFromUsername;
UserCache.delayTime = 0;

const realUsername1 = users[0].username!;
const realUsername2 = users[1].username!;
const fakeUsername = 'fake_username';

beforeEach(async () => {
  mockbot.clear();
  UserCache.clear();
  Cache.clearChannel(mockbot.channelKey);
  vizapiActions.tableForSubmissions = tableForSubmissions;
  vizapiActions.compareMenu = compareMenu;
  vizapiActions.ratingGraph = ratingGraph;
  leetcodeActions.getLanguageStats = getLanguageStats;
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
    expect(mockbot.lastMessage())
      .toEqual('❗ Message should not have any arguments');
  });
});

describe('chatbots.actions - start action', () => {
  test('Correct case', async () => {
    await mockbot.send('/start');
    expect(mockbot.lastMessage()).toEqual(`Welcome! This is Leetcode Rating Bot Elite 😎 Boys

<b>Main commands:</b>
<b><i>/start</i></b> - Starting Page
<b><i>/help</i></b> - FAQ
<b><i>/rating</i></b> - Overall rating of Users
<b><i>/refresh</i></b> - Manual refresh of User Cache
<b><i>/profile</i></b> - Profiles of Users
<b><i>/submissions</i></b> - Submissions for Users
<b><i>/avatar</i></b> - Avatars for Users
<b><i>/problems</i></b> - Chart with Solved Problems for Users
<b><i>/langstats</i></b> - Amount of Solved Problems in each language for Users

<b>User related commands:</b>
<b><i>/add username1 username2</i></b> ... - adding Users
<b><i>/profile username</i></b> - Profile for separate User
<b><i>/avatar username</i></b> - Avatar for User
<b><i>/submissions username</i></b> - Get all recent submissions for User as Table
<b><i>/compare username1 username2</i></b> - Compare 2 Users' stats
<b><i>/problems username</i></b> - Chart with Solved Problems for specific User
<b><i>/langstats username</i></b> - Amount of Solved Problems in each language given User

<b>Admin commands (Only admin or local chat):</b>
<b><i>/remove username</i></b> - Remove User
<b><i>/clear</i></b> - Clear Database from all Users
<b><i>/stats</i></b> - Show Stats for this Bot
`);
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/start excess_arg');
    expect(mockbot.lastMessage())
      .toEqual('❗ Message should not have any arguments');
  });
});

describe('chatbots.actions - help action', () => {
  test('Correct case', async () => {
    await mockbot.send('/help');
    expect(mockbot.lastMessage())
      .toEqual('Contact @madrigals1 in Telegram or madrigals1#9652 in Discord');
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/help excess_arg');
    expect(mockbot.lastMessage())
      .toEqual('❗ Message should not have any arguments');
  });
});

describe('chatbots.actions - add action', () => {
  test('Correct case', async () => {
    // Add 2 users
    await mockbot.send(`/add ${realUsername1} ${realUsername2}`);

    // Cache should have 2 users
    expect(Cache.getChannel(mockbot.channelKey).userAmount).toBe(2);

    // Both usernames should be added
    const msg1 = `<b>${realUsername1}</b> - ✅ User is successfully added\n`;
    const msg2 = `<b>${realUsername2}</b> - ✅ User is successfully added\n`;
    expect(mockbot.lastMessage()).toEqual(`User List:\n${msg1}${msg2}`);
  });

  test('Incorrect case - Existing username', async () => {
    // Clear channel
    await Cache.clearChannel(mockbot.channelKey);

    // Add username
    await mockbot.send(`/add ${realUsername1}`);

    // Username should be added
    const msg1 = `<b>${realUsername1}</b> - ✅ User is successfully added\n`;
    expect(mockbot.lastMessage()).toEqual(`User List:\n${msg1}`);

    // Add same username again
    await mockbot.send(`/add ${realUsername1}`);

    // Username should already exist
    const msg2 = `<b>${realUsername1}</b> - ❗ User already exists in this `
      + 'channel\n';
    expect(mockbot.lastMessage()).toEqual(`User List:\n${msg2}`);
  });

  test('Incorrect case - User not found in Leetcode', async () => {
    // Add incorrect username
    await mockbot.send(`/add ${fakeUsername}`);

    // Generate message
    const message = `<b>${fakeUsername}</b> - ❗ User not found in Leetcode`;

    // Should receive correct message
    expect(mockbot.lastMessage()).toEqual(`User List:\n${message}`);
  });

  test('Incorrect case - Incorrect arguments', async () => {
    // Send message with excess arg
    await mockbot.send('/add');

    // Receive correct message
    expect(mockbot.lastMessage())
      .toEqual('❗ Insufficient arguments in message');
  });
});

describe('chatbots.actions - refresh action', () => {
  test('Correct case', async () => {
    await mockbot.send('/refresh');
    const messages = mockbot.messages();
    expect(messages[0]).toBe('⏳ Cache refresh was requested...');
    expect(messages[1]).toBe('✅ Cache is refreshed');
  });

  test('Incorrect case - Invalid arguments', async () => {
    await mockbot.send('/refresh excess_arg');
    expect(mockbot.lastMessage())
      .toEqual('❗ Message should not have any arguments');
  });
});

describe('chatbots.actions - remove action', () => {
  test('with no users present in database', async () => {
    await mockbot.send('/remove', true);
    expect(mockbot.lastMessage()).toBe('❗ No users found in database');
  });

  test('Correct case - Without username', async () => {
    await Cache.getChannel(mockbot.channelKey).addUser(realUsername1);
    await mockbot.send('/remove', true);
    expect(mockbot.lastMessage()).toBe('🗑️ Remove User');
  });

  // TODO: Check buttons

  test('Correct case - With username', async () => {
    await mockbot.send(`/add ${realUsername1}`);

    await mockbot.send(`/remove ${realUsername1}`, true);
    const messages = mockbot.messages(2);

    expect(messages[0]).toBe(`⏳ User <b>${realUsername1}</b> will be deleted`);
    expect(messages[1])
      .toBe(`✅ User <b>${realUsername1}</b> was successfully deleted`);
  });

  test('Incorrect case - Username does not exist', async () => {
    await mockbot.send(`/remove ${fakeUsername}`, true);
    expect(mockbot.lastMessage())
      .toBe(`❗ User <b>${fakeUsername}</b> does not exist in this channel`);
  });

  test('Incorrect case - Not admin', async () => {
    await mockbot.send(`/remove ${fakeUsername}`, false);
    expect(mockbot.lastMessage()).toBe('❗ You need administrator priveleges '
      + 'to execute this action');
    await mockbot.send('/remove', false);
    expect(mockbot.lastMessage()).toBe('❗ You need administrator priveleges '
      + 'to execute this action');
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/remove 123 123 123');
    expect(mockbot.lastMessage()).toEqual('❗ Error on the server');
  });
});

describe('chatbots.actions - clear action', () => {
  test('Correct case', async () => {
    await mockbot.send(`/add ${realUsername1} ${realUsername2}`);

    expect(Cache.getChannel(mockbot.channelKey).userAmount).toBe(2);

    await mockbot.send('/clear', true);

    const messages = mockbot.messages(2);

    expect(messages[0]).toEqual('🗑️ Channel will be cleared');
    expect(messages[1]).toEqual('✅ Channel was cleared');

    expect(Cache.getChannel(mockbot.channelKey).userAmount).toBe(0);
  });

  test('Incorrect case - Not admin', async () => {
    await mockbot.send('/clear');
    expect(mockbot.lastMessage()).toBe('❗ You need administrator priveleges '
      + 'to execute this action');
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/clear asd asd');
    expect(mockbot.lastMessage())
      .toEqual('❗ Message should not have any arguments');
  });
});

describe('chatbots.actions - stats action', () => {
  test('Correct case', async () => {
    // Add 2 Users
    await mockbot.send(`/add ${realUsername1} ${realUsername2}`);

    await mockbot.send('/stats', true);

    expect(mockbot.lastMessage())
      .toEqual(`
<b>PROVIDER RELATED</b>
<b>Provider:</b> Mockbot
<b>Prefix:</b> /
<b>Discord enabled:</b> true
<b>Telegram enabled:</b> true
<b>Slack enabled:</b> false

<b>DATABASE RELATED</b>
<b>User Count:</b> 2

<b>USER LIST</b>
<b>- ${realUsername2}</b>
<b>- ${realUsername1}</b>`);
  });

  test('Incorrect case - Not admin', async () => {
    await mockbot.send('/stats', false);
    expect(mockbot.lastMessage()).toBe('❗ You need administrator priveleges '
      + 'to execute this action');
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/stats asd asd');
    expect(mockbot.lastMessage())
      .toEqual('❗ Message should not have any arguments');
  });
});

describe('chatbots.actions - rating action', () => {
  test('Correct case - Regular rating', async () => {
    // Confirm that 2 users exist in Database
    await mockbot.send(`/add ${realUsername1} ${realUsername2}`);
    expect(Cache.getChannel(mockbot.channelKey).userAmount).toBe(2);

    // Test regular rating with correct arguments
    await mockbot.send('/rating');

    expect(mockbot.lastMessage())
      .toEqual(`1. <b>${realUsername2}</b> 752\n`
        + `2. <b>${realUsername1}</b> 124`);
  });

  test('Correct case - Cumulative rating', async () => {
    await mockbot.send(`/add ${realUsername1} ${realUsername2}`);
    await mockbot.send('/rating cml');

    expect(mockbot.lastMessage()).toEqual(`Cumulative Rating:
🟢 Easy - <b>0.5 points</b>
🟡 Medium - <b>1.5 points</b>
🔴 Hard - <b>5 points</b>

1. <b>${realUsername2}</b> 6000
2. <b>${realUsername1}</b> 5000`);
  });

  test('Correct case - Graph rating', async () => {
    vizapiActions.ratingGraph = mockRatingGraph;

    await mockbot.send('/rating graph');
    expect(mockbot.lastMessage()).toEqual('📊 Graph Rating');
    // TODO: Test buttons

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vizapiActions.ratingGraph = (u: User[]) => new Promise((resolve) => {
      resolve({ link: undefined });
    });

    await mockbot.send('/rating graph');
    expect(mockbot.lastMessage()).toEqual('❗ Error on the server');
  });

  // TODO: Test with 10 users

  test('Incorrect case - Incorrect rating type', async () => {
    await mockbot.send('/rating asd');
    expect(mockbot.lastMessage()).toEqual('❗ Incorrect rating type');
  });

  test('Incorrect case - No users', async () => {
    vizapiActions.ratingGraph = mockRatingGraph;
    await UserCache.clear();

    // Regular Rating with 0 users
    await mockbot.send('/rating');
    expect(mockbot.lastMessage()).toEqual('❗ No users found in database');

    // CML Rating with 0 users
    await mockbot.send('/rating cml');
    expect(mockbot.lastMessage()).toEqual('❗ No users found in database');

    // CML Rating with 0 users
    await mockbot.send('/rating graph');
    expect(mockbot.lastMessage()).toEqual('📊 Graph Rating');

    vizapiActions.ratingGraph = ratingGraph;
  });
});

describe('chatbots.actions - profile action', () => {
  test('with no users present in database', async () => {
    await mockbot.send('/profile');
    expect(mockbot.lastMessage()).toEqual('❗ No users found in database');
  });

  test('Correct case - All users', async () => {
    await Cache.getChannel(mockbot.channelKey).addUser(realUsername1);
    await mockbot.send('/profile');
    expect(mockbot.lastMessage()).toEqual('👤 Profiles');
  });

  /* TODO: Test buttons */

  test('Correct case - Single user', async () => {
    await mockbot.send(`/add ${realUsername1}`);
    await mockbot.send(`/profile ${realUsername1}`);
    expect(mockbot.lastMessage())
      .toEqual(`<b>Random User Name</b> - <b>https://leetcode.com/random_username</b>

Solved Problems:
🟢 Easy - <b>1000</b>
🟡 Medium - <b>1000</b>
🔴 Hard - <b>1000</b>
🔵 All - <b>3000 / 1700</b>
🔷 Cumulative - <b>5000</b>`);
  });

  test('Incorrect case - Username not found', async () => {
    await mockbot.send(`/profile ${fakeUsername}`);
    expect(mockbot.lastMessage())
      .toEqual(`❗ User <b>${fakeUsername}</b> does not exist in this channel`);
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/profile asd asd');
    expect(mockbot.lastMessage()).toEqual('❗ Error on the server');
  });
});

describe('chatbots.actions - avatar action', () => {
  test('with no users present in database', async () => {
    await mockbot.send('/avatar');
    expect(mockbot.lastMessage()).toEqual('❗ No users found in database');
  });

  test('Correct case - All users', async () => {
    await Cache.getChannel(mockbot.channelKey).addUser(realUsername1);
    await mockbot.send('/avatar');
    expect(mockbot.lastMessage()).toEqual('📷 Avatars');
  });

  /* TODO: Test buttons */

  test('Correct case - Single user', async () => {
    await mockbot.send(`/add ${realUsername1}`);
    await mockbot.send(`/avatar ${realUsername1}`);

    const user = UserCache.getUser(realUsername1);
    const context = mockbot.getContext();

    expect(context?.photoUrl).toBeDefined();
    expect(context!.photoUrl).toEqual(user?.profile?.userAvatar);
    expect(mockbot.lastMessage()).toEqual(`${realUsername1}'s avatar`);
  });

  test('Incorrect case - Username not found', async () => {
    await mockbot.send(`/avatar ${fakeUsername}`);
    expect(mockbot.lastMessage())
      .toEqual(`❗ User <b>${fakeUsername}</b> does not exist in this channel`);
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/avatar asd asd');
    expect(mockbot.lastMessage()).toEqual('❗ Error on the server');
  });
});

describe('chatbots.actions - submissions action', () => {
  test('with no users present in database', async () => {
    await mockbot.send('/submissions');
    expect(mockbot.lastMessage()).toEqual('❗ No users found in database');
  });

  test('Correct case - All users', async () => {
    await Cache.getChannel(mockbot.channelKey).addUser(realUsername1);
    await mockbot.send('/submissions');
    expect(mockbot.lastMessage()).toEqual('📋 Submissions');
  });

  /* TODO: Test buttons */

  test('Correct case - Single user', async () => {
    vizapiActions.tableForSubmissions = mockTableForSubmissions;

    await mockbot.send(`/add ${realUsername1}`);
    await mockbot.send(`/submissions ${realUsername1}`);

    const context = mockbot.getContext();

    expect(context?.photoUrl).toBeDefined();
    expect(context!.photoUrl).toEqual('http://random_link');
    expect(mockbot.lastMessage())
      .toEqual(`${realUsername1}'s recent submissions`);
  });

  test('Incorrect case - Username not found', async () => {
    await mockbot.send(`/submissions ${fakeUsername}`);
    expect(mockbot.lastMessage())
      .toEqual(`❗ User <b>${fakeUsername}</b> does not exist in this channel`);
  });

  test('Incorrect case - User has no submissions', async () => {
    const username = 'clone_username';
    const newUser = _.cloneDeep(users[0]);
    newUser.username = username;
    newUser.submitStats!.acSubmissionNum = [];
    users.push(newUser);

    vizapiActions.tableForSubmissions = mockTableForSubmissions;

    await mockbot.send(`/add ${username}`);
    await mockbot.send(`/submissions ${username}`);

    expect(mockbot.lastMessage())
      .toEqual(`❗ User <b>${username}</b> does not have any submissions`);
    users.pop();
  });

  test('Incorrect case - Error on the server', async () => {
    const username = 'clone_username_2';
    const newUser2 = _.cloneDeep(users[0]);
    newUser2.username = username;
    newUser2.submitStats = undefined;
    users.push(newUser2);

    vizapiActions.tableForSubmissions = mockTableForSubmissions;

    await mockbot.send(`/add ${username}`);
    await mockbot.send(`/submissions ${username}`);

    expect(mockbot.lastMessage()).toEqual('❗ Error on the server');
    users.pop();
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/submissions asd asd');
    expect(mockbot.lastMessage()).toEqual('❗ Error on the server');
  });
});

describe('chatbots.actions - problems action', () => {
  test('with no users present in database', async () => {
    await mockbot.send('/problems');
    expect(mockbot.lastMessage()).toEqual('❗ No users found in database');
  });

  test('Correct case - All users', async () => {
    await Cache.getChannel(mockbot.channelKey).addUser(realUsername1);
    await mockbot.send('/problems');
    expect(mockbot.lastMessage()).toEqual('📊 Problems');
  });

  test('Correct case - Single user', async () => {
    await mockbot.send(`/add ${realUsername1}`);
    await mockbot.send(`/problems ${realUsername1}`);
    expect(mockbot.lastMessage())
      .toEqual(`${realUsername1}'s solved problems chart`);
  });

  test('Incorrect case - Username not found', async () => {
    await mockbot.send(`/problems ${fakeUsername}`);
    expect(mockbot.lastMessage())
      .toEqual(`❗ User <b>${fakeUsername}</b> does not exist in this channel`);
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
    expect(mockbot.lastMessage()).toEqual('❗ Error on the server');
    users.pop();
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/problems asd asd asd');
    expect(mockbot.lastMessage()).toEqual('❗ Error on the server');
  });
});

describe('chatbots.actions - compare action', () => {
  test('with no users present in database', async () => {
    await mockbot.send('/compare');
    expect(mockbot.lastMessage()).toEqual('❗ No users found in database');
  });

  test('Correct case - Select left user', async () => {
    await Cache.getChannel(mockbot.channelKey).addUser(realUsername1);
    await Cache.getChannel(mockbot.channelKey).addUser(realUsername2);
    await mockbot.send('/compare');
    expect(mockbot.lastMessage()).toEqual('👤 Select Left User');
  });

  /* TODO: Test buttons */

  test('Correct case - Select right user', async () => {
    await Cache.getChannel(mockbot.channelKey).addUser(realUsername1);
    await Cache.getChannel(mockbot.channelKey).addUser(realUsername2);
    await mockbot.send(`/compare ${realUsername1}`);
    expect(mockbot.lastMessage()).toEqual('👤 Select Right User');
  });

  test('Correct case - Both users picked', async () => {
    vizapiActions.compareMenu = mockCompareMenu;

    await mockbot.send(`/add ${realUsername1} ${realUsername2}`);
    await mockbot.send(`/compare ${realUsername1} ${realUsername2}`);

    const context = mockbot.getContext();

    expect(context?.photoUrl).toBeDefined();
    expect(context!.photoUrl).toEqual('http://random_link_compare');
    expect(mockbot.lastMessage())
      .toEqual(`Comparing ${realUsername1} to ${realUsername2}`);
  });

  test('Incorrect case - Right user not found', async () => {
    await mockbot.send(`/add ${realUsername1}`);
    await mockbot.send(`/compare ${realUsername1} ${fakeUsername}`);
    expect(mockbot.lastMessage())
      .toEqual(`❗ User <b>${fakeUsername}</b> does not exist in this channel`);
  });

  test('Incorrect case - Left user not found', async () => {
    await mockbot.send(`/add ${realUsername1}`);
    await mockbot.send(`/compare ${fakeUsername} ${realUsername1}`);
    expect(mockbot.lastMessage())
      .toEqual(`❗ User <b>${fakeUsername}</b> does not exist in this channel`);
  });

  test('Incorrect case - Error on the server', async () => {
    vizapiActions.compareMenu = mockCompareMenu;

    const thirdUsername = 'clone_username';

    const newUser = _.cloneDeep(users[0]);
    newUser.username = thirdUsername;
    newUser.name = undefined;
    users.push(newUser);

    await mockbot.send(`/add ${realUsername1} ${thirdUsername}`);
    await mockbot.send(`/compare ${realUsername1} ${thirdUsername}`);

    expect(mockbot.lastMessage()).toEqual('❗ Error on the server');
    users.pop();
  });

  test('Incorrect case - Too many args', async () => {
    await mockbot.send('/compare asd asd asd');
    expect(mockbot.lastMessage()).toEqual('❗ Error on the server');
  });
});

describe('chatbots.actions - langstats action', () => {
  test('with no users present in database', async () => {
    await mockbot.send('/langstats');
    expect(mockbot.lastMessage()).toEqual('❗ No users found in database');
  });

  test('Correct case - All users', async () => {
    await Cache.getChannel(mockbot.channelKey).addUser(realUsername1);
    leetcodeActions.getLanguageStats = mockLanguageStats;

    await mockbot.send('/langstats');
    expect(mockbot.lastMessage()).toEqual('👨‍💻 Language stats');
  });

  /* TODO: Test buttons */

  test('Correct case - Single user', async () => {
    leetcodeActions.getLanguageStats = mockLanguageStats;

    await mockbot.send(`/add ${realUsername1} ${realUsername2}`);
    await mockbot.send(`/langstats ${realUsername1}`);

    expect(mockbot.lastMessage())
      .toEqual(`👨‍💻 Problems solved by <b>${realUsername1}</b> in:
- <b>C++</b> 421
- <b>Python</b> 200
- <b>JavaScript</b> 127`);

    await mockbot.send(`/langstats ${realUsername2}`);

    expect(mockbot.lastMessage())
      .toEqual(`👨‍💻 Problems solved by <b>${realUsername2}</b> in:
- <b>TypeScript</b> 10
- <b>C#</b> 5`);
  });

  test('Incorrect case - Username not found', async () => {
    leetcodeActions.getLanguageStats = mockLanguageStats;

    await mockbot.send(`/langstats ${fakeUsername}`);
    expect(mockbot.lastMessage())
      .toEqual(`❗ User <b>${fakeUsername}</b> does not exist in this channel`);
  });
});
