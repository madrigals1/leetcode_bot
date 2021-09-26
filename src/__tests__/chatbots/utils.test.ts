/* eslint-disable camelcase */
/* eslint-disable no-console */
import { mockReplyMarkupOptions, user1, user2 } from '../__mocks__/data.mock';
import {
  getCompareDataFromUser,
  compareMenu,
  tableForSubmissions,
  generateReplyMarkup,
} from '../../chatbots/utils';
import dictionary from '../../utils/dictionary';
import { isValidHttpUrl } from '../../utils/helper';
import constants from '../../utils/constants';

const { VIZAPI_LINK } = constants;

beforeEach(() => {
  // Fix VizAPI link before each test case
  constants.VIZAPI_LINK = VIZAPI_LINK;
});

afterEach(() => {
  //
});

beforeAll(async () => {
  jest.setTimeout(100000);
});

afterAll(async () => {
  jest.setTimeout(5000);
});

test('chatbots.utils.getCompareDataFromUser action', async () => {
  // Get compare data from user
  const compareData = getCompareDataFromUser(user1);

  // Compare fields
  expect(compareData.image).toBe(user1.profile.userAvatar);

  compareData.bio_fields.forEach(({ name, value }) => {
    switch (name) {
      case 'Name':
        expect(value).toBe(user1.name);
        break;
      case 'Username':
        expect(value).toBe(user1.username);
        break;
      case 'Location':
        expect(value).toBe(user1.profile.countryName);
        break;
      case 'Company':
        expect(value).toBe(user1.profile.company);
        break;

      default:
        break;
    }
  });

  compareData.compare_fields.forEach(({ name, value }) => {
    switch (name) {
      case 'Problems Solved':
        expect(value).toBe(user1.solved);
        break;
      case 'Contest Rating':
        expect(value)
          .toBe(Math.round(user1.contestData.userContestRanking?.rating));
        break;
      case 'Location':
        expect(value).toBe(user1.submitStats.totalSubmissionNum[0].submissions);
        break;
      case 'Company':
        expect(value).toBe(user1.contributions.points);
        break;

      default:
        break;
    }
  });

  expect(compareData.image).toBe(user1.profile.userAvatar);
});

test('chatbots.utils.compareMenu action', async () => {
  // Valid
  const compareResponse = await compareMenu(user1, user2);

  expect(console.log)
    .toHaveBeenCalledWith(dictionary.SERVER_MESSAGES.IMAGE_WAS_CREATED);
  expect(isValidHttpUrl(compareResponse.link)).toBe(true);
  expect(compareResponse.error).toBe(undefined);
  expect(compareResponse.reason).toBe(undefined);

  // Invalid: Invalid url
  constants.VIZAPI_LINK = 'incorrect_url';
  const compareResponseFailure = await compareMenu(user1, user2);

  expect(console.log).toHaveBeenCalled();
  expect(compareResponseFailure.error === undefined).toBe(false);
  expect(compareResponseFailure.reason)
    .toBe(dictionary.SERVER_MESSAGES.API_NOT_WORKING);
});

test('chatbots.utils.tableForSubmissions action', async () => {
  // Valid
  const tableForSubmissionsResponse = await tableForSubmissions(user1);

  expect(console.log)
    .toHaveBeenCalledWith(dictionary.SERVER_MESSAGES.IMAGE_WAS_CREATED);
  expect(isValidHttpUrl(tableForSubmissionsResponse.link)).toBe(true);
  expect(tableForSubmissionsResponse.error).toBe(undefined);
  expect(tableForSubmissionsResponse.reason).toBe(undefined);

  // Invalid: User is not sent
  const compareResponseFailure1 = await tableForSubmissions(undefined);
  const errorMessage = 'Username not found';

  expect(console.log).toHaveBeenCalled();
  expect(compareResponseFailure1.error).toBe(errorMessage);
  expect(compareResponseFailure1.reason)
    .toBe(dictionary.SERVER_MESSAGES.ERROR_ON_THE_SERVER(errorMessage));

  // Invalid: User has no submissions
  const userWithoutSubmissions = { ...user1, submissions: [] };
  const compareResponseFailure2 = (
    await tableForSubmissions(userWithoutSubmissions)
  );
  const dictMessageWithoutSubmissions = (
    dictionary.BOT_MESSAGES.USER_NO_SUBMISSIONS(userWithoutSubmissions.username)
  );

  expect(console.log).toHaveBeenCalled();
  expect(compareResponseFailure2.error).toBe(dictMessageWithoutSubmissions);
  expect(compareResponseFailure2.reason)
    .toBe(dictionary.SERVER_MESSAGES.NO_SUBMISSIONS);

  // Invalid: Incorrect URL
  constants.VIZAPI_LINK = 'incorrect_url';
  const compareResponseFailure3 = await tableForSubmissions(user1);

  expect(console.log).toHaveBeenCalled();
  expect(compareResponseFailure3.error === undefined).toBe(false);
  expect(compareResponseFailure3.reason)
    .toBe(dictionary.SERVER_MESSAGES.API_NOT_WORKING);
});

test('chatbots.utils.generateReplyMarkup action', async () => {
  // Valid: Without close button
  const mockOptions = mockReplyMarkupOptions(3, false);
  const replyMarkupResponse = generateReplyMarkup(mockOptions);
  const parsedResponse = JSON.parse(replyMarkupResponse);

  expect(parsedResponse.inline_keyboard === undefined).toBe(false);

  const firstRow = parsedResponse.inline_keyboard[0];

  for (let i = 0; i < firstRow.length; i++) {
    const { text, callback_data } = firstRow[i];

    expect(text).toBe(`Button ${i + 1}`);
    expect(callback_data).toBe(`Action ${i + 1}`);
  }

  // Valid: With close button
  const mockOptionsWithClose = mockReplyMarkupOptions(3, true);
  const replyMarkupResponseClose = generateReplyMarkup(mockOptionsWithClose);
  const parsedResponseClose = JSON.parse(replyMarkupResponseClose);

  expect(parsedResponseClose.inline_keyboard === undefined).toBe(false);

  const secondRow = parsedResponseClose.inline_keyboard[1][0];

  expect(secondRow.text).toBe(`${constants.EMOJI.CROSS_MARK} Close`);
  expect(secondRow.callback_data).toBe('placeholder');

  // Valid: 8 buttons
  const mockOptions8buttons = mockReplyMarkupOptions(8, false);
  const replyMarkupResponse8buttons = generateReplyMarkup(mockOptions8buttons);
  const parsedResponse8buttons = JSON.parse(replyMarkupResponse8buttons);

  expect(parsedResponse8buttons.inline_keyboard === undefined).toBe(false);

  for (let i = 0; i < 8; i++) {
    const x = Math.floor(i / 3);
    const y = i % 3;

    const { text, callback_data } = (
      parsedResponse8buttons.inline_keyboard[x][y]
    );

    expect(text).toBe(`Button ${i + 1}`);
    expect(callback_data).toBe(`Action ${i + 1}`);
  }
});
