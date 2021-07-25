import Mockbot from '../__mocks__/chatbots/mockbot';
import dictionary from '../../utils/dictionary';
import Cache from '../../cache';
import getLeetcodeDataFromUsername from '../__mocks__/utils.mock';
import MockDatabaseProvider from '../__mocks__/database.mock';
import constants from '../../utils/constants';

const mockbot = new Mockbot();
Cache.database = new MockDatabaseProvider();
Cache.getLeetcodeDataFromUsername = getLeetcodeDataFromUsername;
Cache.delayTime = 0;

const mockPassword = 'random_password';
constants.MASTER_PASSWORD = mockPassword;

beforeEach(() => {
  mockbot.clear();
  Cache.clearUsers();
  Cache.userLimit = parseInt(constants.USER_AMOUNT_LIMIT, 10);
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

  // Test with incorrect arguments (Arguments count)
  await mockbot.send('/remove');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.INCORRECT_INPUT);

  await mockbot.send('/remove 123 123 123');

  expect(mockbot.lastMessage())
    .toEqual(dictionary.BOT_MESSAGES.INCORRECT_INPUT);
});
