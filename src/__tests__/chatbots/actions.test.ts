import Mockbot from '../__mocks__/chatbots/mockbot';
import dictionary from '../../utils/dictionary';
import Cache from '../../cache';
import getLeetcodeDataFromUsername from '../__mocks__/utils.mock';
import MockDatabaseProvider from '../__mocks__/database.mock';

const mockbot = new Mockbot();
Cache.database = new MockDatabaseProvider();
Cache.getLeetcodeDataFromUsername = getLeetcodeDataFromUsername;
Cache.delayTime = 0;

beforeEach(() => mockbot.clear());

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
