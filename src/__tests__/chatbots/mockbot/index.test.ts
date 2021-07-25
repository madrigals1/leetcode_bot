import Mockbot from '../../__mocks__/chatbots/mockbot';
import dictionary from '../../../utils/dictionary';

const mockbot = new Mockbot();

beforeEach(() => mockbot.clear());

test('chatbots.actions.start action', async () => {
  await mockbot.send('/start');

  expect(mockbot.receive()).toEqual(
    dictionary.BOT_MESSAGES.WELCOME_TEXT(mockbot.prefix),
  );

  await mockbot.send('/start excess_arg');

  expect(mockbot.receive()).toEqual(dictionary.BOT_MESSAGES.INCORRECT_INPUT);
});
