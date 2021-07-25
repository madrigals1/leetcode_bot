import * as _ from 'lodash';

import Mockbot from '../__mocks__/chatbots/mockbot';
import dictionary from '../../utils/dictionary';
import Cache from '../../cache';
import {
  mockGetLeetcodeDataFromUsername, mockTableForSubmissions, mockCompareMenu,
} from '../__mocks__/utils.mock';
import MockDatabaseProvider from '../__mocks__/database.mock';
import constants from '../../utils/constants';
import { vizapiActions } from '../../chatbots/actions';
import { tableForSubmissions, compareMenu } from '../../chatbots/utils';
import users from '../__mocks__/data.mock';

const mockbot = new Mockbot();
Cache.database = new MockDatabaseProvider();
Cache.getLeetcodeDataFromUsername = mockGetLeetcodeDataFromUsername;
Cache.delayTime = 0;

const mockPassword = 'random_password';
constants.MASTER_PASSWORD = mockPassword;

beforeEach(() => {
  mockbot.clear();
  Cache.clearUsers();
  Cache.userLimit = parseInt(constants.USER_AMOUNT_LIMIT, 10);
  vizapiActions.tableForSubmissions = tableForSubmissions;
  vizapiActions.compareMenu = compareMenu;
});

test('chatbots.actions.start action', async () => {
  // Test with correct arguments
  await mockbot.send('/start');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.WELCOME_TEXT(mockbot.prefix));

  // Test with incorrect arguments
  await mockbot.send('/start excess_arg');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.INCORRECT_INPUT);
});

test('chatbots.actions.add action', async () => {
  // Test correct case of addition
  await mockbot.send('/add random_username random_username_2');

  const message1 = dictionary.BOT_MESSAGES.USERNAME_WAS_ADDED(
    'random_username', Cache.userAmount - 1, Cache.userLimit,
  );
  const message2 = dictionary.BOT_MESSAGES.USERNAME_WAS_ADDED(
    'random_username_2', Cache.userAmount, Cache.userLimit,
  );

  expect(Cache.users.length).toBe(2);

  expect(mockbot.lastMessage()).toEqual(`User List:\n${message1}${message2}`);

  // Test error cases (existing username, invalid username)
  await mockbot.send('/add random_username incorrect_username');

  const message3 = dictionary.BOT_MESSAGES.USERNAME_ALREADY_EXISTS(
    'random_username',
  );
  const message4 = dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND_ON_LEETCODE(
    'incorrect_username',
  );

  expect(mockbot.lastMessage()).toEqual(`User List:\n${message3}${message4}`);

  // Test error cases (user limit)
  await Cache.clearUsers();
  Cache.userLimit = 0;

  await mockbot.send('/add random_username random_username_2');

  const message5 = dictionary.BOT_MESSAGES.USERNAME_NOT_ADDED_USER_LIMIT(
    'random_username', Cache.userLimit,
  );
  const message6 = dictionary.BOT_MESSAGES.USERNAME_NOT_ADDED_USER_LIMIT(
    'random_username_2', Cache.userLimit,
  );

  expect(mockbot.lastMessage()).toEqual(`User List:\n${message5}${message6}`);

  // Test error cases (incorrect arguments)
  await mockbot.send('/add');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.INCORRECT_INPUT);
});

test('chatbots.actions.refresh action', async () => {
  // Test with correct arguments
  await mockbot.send('/refresh');

  const messages = mockbot.messages();

  expect(messages[0]).toBe(dictionary.BOT_MESSAGES.STARTED_REFRESH);
  expect(messages[1]).toBe(dictionary.BOT_MESSAGES.IS_REFRESHED);

  // Test with incorrect arguments
  await mockbot.send('/refresh excess_arg');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.INCORRECT_INPUT);
});

test('chatbots.actions.remove action', async () => {
  // Test with correct arguments (Without username)
  await mockbot.send(`/remove ${mockPassword}`);

  expect(mockbot.lastMessage()).toBe(dictionary.BOT_MESSAGES.USER_LIST_REMOVE);
  /* TODO: Check buttons */

  // Test with correct arguments (With username)
  await mockbot.send('/add random_username');

  await mockbot.send(`/remove random_username ${mockPassword}`);
  const messages = mockbot.messages(2);

  expect(messages[0])
    .toBe(dictionary.BOT_MESSAGES.USERNAME_WILL_BE_DELETED('random_username'));
  expect(messages[1])
    .toBe(dictionary.BOT_MESSAGES.USERNAME_WAS_DELETED('random_username'));

  // Test with incorrect arguments (Username doesn't exist)
  await mockbot.send(`/remove not_existing_username ${mockPassword}`);

  expect(mockbot.lastMessage())
    .toBe(dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND('not_existing_username'));

  // Test with incorrect arguments (Incorrect password)
  await mockbot.send('/remove blablabla incorrect_password');

  expect(mockbot.lastMessage())
    .toBe(dictionary.BOT_MESSAGES.PASSWORD_IS_INCORRECT);

  await mockbot.send('/remove incorrect_password');

  expect(mockbot.lastMessage())
    .toBe(dictionary.BOT_MESSAGES.PASSWORD_IS_INCORRECT);

  // Test with incorrect arguments (Arguments count)
  await mockbot.send('/remove');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.INCORRECT_INPUT);

  await mockbot.send('/remove 123 123 123');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.INCORRECT_INPUT);
});

test('chatbots.actions.clear action', async () => {
  // Test with correct arguments
  await mockbot.send('/add random_username random_username_2');

  expect(Cache.users.length).toBe(2);

  await mockbot.send(`/clear ${mockPassword}`);

  expect(Cache.users.length).toBe(0);

  const messages = mockbot.messages(2);

  expect(messages[0]).toEqual(dictionary.BOT_MESSAGES.DATABASE_WILL_BE_CLEARED);
  expect(messages[1]).toEqual(dictionary.BOT_MESSAGES.DATABASE_WAS_CLEARED);

  // Test with incorrect arguments (incorrect password)
  await mockbot.send('/clear incorrect_password');

  expect(mockbot.lastMessage())
    .toBe(dictionary.BOT_MESSAGES.PASSWORD_IS_INCORRECT);

  // Test with incorrect arguments (argument count)
  await mockbot.send('/clear');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.INCORRECT_INPUT);

  await mockbot.send('/clear asd asd');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.INCORRECT_INPUT);
});

test('chatbots.actions.stats action', async () => {
  // Test with correct arguments
  await mockbot.send(`/stats ${mockPassword}`);

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.STATS_TEXT(mockbot.name, Cache));

  // Test with incorrect arguments (incorrect password)
  await mockbot.send('/stats incorrect_password');

  expect(mockbot.lastMessage())
    .toBe(dictionary.BOT_MESSAGES.PASSWORD_IS_INCORRECT);

  // Test with incorrect arguments (argument count)
  await mockbot.send('/stats');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.INCORRECT_INPUT);

  await mockbot.send('/stats asd asd');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.INCORRECT_INPUT);
});

test('chatbots.actions.rating action', async () => {
  // Test with correct arguments
  await mockbot.send('/rating');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.RATING_TEXT(Cache.allUsers()));

  // Test with incorrect arguments (argument count)
  await mockbot.send('/rating asd');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.INCORRECT_INPUT);
});

test('chatbots.actions.profile action', async () => {
  // Test with correct arguments (all users)
  await mockbot.send('/profile');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.USER_LIST_PROFILES);
  /* TODO: Test buttons */

  // Test with correct arguments (single user)
  await mockbot.send('/add random_username');

  await mockbot.send('/profile random_username');

  const user = Cache.loadUser('random_username');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.USER_TEXT(user));
  /* TODO: Test buttons */

  // Test with incorrect arguments (Username not found)
  await mockbot.send('/profile not_found');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND('not_found'));

  // Test with incorrect arguments (argument count)
  await mockbot.send('/profile asd asd');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.INCORRECT_INPUT);
});

test('chatbots.actions.avatar action', async () => {
  // Test with correct arguments (all users)
  await mockbot.send('/avatar');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.USER_LIST_AVATARS);
  /* TODO: Test buttons */

  // Test with correct arguments (single user)
  await mockbot.send('/add random_username');
  await mockbot.send('/avatar random_username');

  const user = Cache.loadUser('random_username');
  const context = mockbot.getContext();

  expect(context.photoUrl).toEqual(user.profile.userAvatar);
  expect(mockbot.lastMessage()).toEqual('');

  // Test with incorrect arguments (Username not found)
  await mockbot.send('/avatar not_found');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND('not_found'));

  // Test with incorrect arguments (argument count)
  await mockbot.send('/avatar asd asd');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.INCORRECT_INPUT);
});

test('chatbots.actions.submissions action', async () => {
  // Test with correct arguments (all users)
  await mockbot.send('/submissions');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.USER_LIST_SUBMISSIONS);
  /* TODO: Test buttons */

  // Test with correct arguments (single user)
  await mockbot.send('/add random_username');

  vizapiActions.tableForSubmissions = mockTableForSubmissions;

  await mockbot.send('/submissions random_username');

  const context = mockbot.getContext();

  expect(context.photoUrl).toEqual('http://random_link');
  expect(mockbot.lastMessage()).toEqual('');

  // Test with incorrect arguments (Username not found)
  await mockbot.send('/submissions not_found');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND('not_found'));

  // Test with incorrect arguments (User has no submissions)
  const newUser = _.cloneDeep(Cache.users[0]);
  newUser.username = 'clone_username';
  newUser.submitStats.acSubmissionNum = [];
  users.push(newUser);
  await mockbot.send('/add clone_username');

  await mockbot.send('/submissions clone_username');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.USER_NO_SUBMISSIONS('clone_username'));

  users.pop();

  // Test with incorrect arguments (Error on the server)
  const newUser2 = _.cloneDeep(Cache.users[0]);
  newUser2.username = 'clone_username_2';
  newUser2.submitStats = null;
  users.push(newUser2);
  await mockbot.send('/add clone_username_2');

  await mockbot.send('/submissions clone_username_2');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.ERROR_ON_THE_SERVER);

  users.pop();

  // Test with incorrect arguments (argument count)
  await mockbot.send('/submissions asd asd');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.INCORRECT_INPUT);
});

test('chatbots.actions.compare action', async () => {
  // Test with correct arguments (without users)
  await mockbot.send('/compare');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.SELECT_LEFT_USER);
  /* TODO: Test buttons */

  // Test with correct arguments (single user)
  await mockbot.send('/compare random_username');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.SELECT_RIGHT_USER);
  /* TODO: Test buttons */

  vizapiActions.compareMenu = mockCompareMenu;

  // Test with correct arguments (both users)
  await mockbot.send('/add random_username random_username_2');
  await mockbot.send('/compare random_username random_username_2');

  const context = mockbot.getContext();

  expect(context.photoUrl).toEqual('http://random_link_compare');
  expect(mockbot.lastMessage()).toEqual('');

  // Test with incorrect arguments (Right User not found)
  await mockbot.send('/compare random_username not_found_1');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND('not_found_1'));

  // Test with incorrect arguments (Left User not found)
  await mockbot.send('/compare not_found_2 random_username');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND('not_found_2'));

  // Test with incorrect arguments (Error on the server)
  const newUser = _.cloneDeep(Cache.users[0]);
  newUser.username = 'clone_username';
  newUser.name = null;
  users.push(newUser);
  await mockbot.send('/add clone_username');

  await mockbot.send('/compare random_username clone_username');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.ERROR_ON_THE_SERVER);

  users.pop();

  // Test with incorrect arguments (argument count)
  await mockbot.send('/compare asd asd asd');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.INCORRECT_INPUT);
});
