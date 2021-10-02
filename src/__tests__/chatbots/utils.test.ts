/* eslint-disable camelcase */
/* eslint-disable no-console */
import { user1, user2, users } from '../__mocks__/data.mock';
import {
  mockReplyMarkupOptions, mockButtonOptions, mockUserWithSolved,
} from '../__mocks__/utils.mock';
import {
  getCompareDataFromUser,
  compareMenu,
  tableForSubmissions,
  generateReplyMarkup,
  createButtonsFromUsers,
  calculateCml,
  getCmlFromUser,
} from '../../chatbots/utils';
import dictionary from '../../utils/dictionary';
import { isValidHttpUrl } from '../../utils/helper';
import constants from '../../utils/constants';
import Cache from '../../cache';

const { VIZAPI_LINK, CML } = constants;
const savedUsers = [...Cache.users];

beforeEach(() => {
  // Fix changed values before each test case
  constants.VIZAPI_LINK = VIZAPI_LINK;
  constants.CML = CML;
  Cache.users = [...savedUsers];
});

afterEach(() => {
  //
});

beforeAll(async () => {
  jest.setTimeout(30000);
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
  const userWithoutSubmissions = { ...user1, computed: { submissions: [] } };
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

  expect(firstRow.length).toBe(3);

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

  const secondRow = parsedResponseClose.inline_keyboard[1];

  expect(secondRow.length).toBe(1);

  expect(secondRow[0].text).toBe(`${constants.EMOJI.CROSS_MARK} Close`);
  expect(secondRow[0].callback_data).toBe('placeholder');

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

test('chatbots.utils.createButtonsFromUsers action', async () => {
  // Valid: 2 users
  const action1 = 'action1';
  Cache.users = users;
  const mockOptions1 = mockButtonOptions(action1);
  const buttonsResponse1 = createButtonsFromUsers(mockOptions1);

  expect(buttonsResponse1.length).toBe(2);

  const user1response1 = buttonsResponse1[0];
  const user2response1 = buttonsResponse1[1];

  expect(user1response1.text).toBe(user1.username);
  expect(user2response1.text).toBe(user2.username);

  expect(user1response1.action).toBe(`/${action1} ${user1.username} `);
  expect(user2response1.action).toBe(`/${action1} ${user2.username} `);

  // Valid: 3 users
  const action2 = 'action2';
  Cache.users = [...users, { ...user1, username: 'other_username' }];
  const mockOptions2 = mockButtonOptions(action2);
  const buttonsResponse2 = createButtonsFromUsers(mockOptions2);

  expect(buttonsResponse2.length).toBe(3);

  // Valid: Add password
  const action3 = 'action3';
  const password3 = 'password3';
  Cache.users = [...users];
  const mockOptions3 = mockButtonOptions(action3, password3);
  const buttonsResponse3 = createButtonsFromUsers(mockOptions3);

  const user1response2 = buttonsResponse3[0];
  const user2response2 = buttonsResponse3[1];

  expect(user1response2.action).toBe(`/${action3} ${user1.username} ${password3}`);
  expect(user2response2.action).toBe(`/${action3} ${user2.username} ${password3}`);

  // Valid: No users
  Cache.users = [];
  const mockOptions4 = mockButtonOptions('');
  const buttonsResponse4 = createButtonsFromUsers(mockOptions4);

  expect(buttonsResponse4.length).toBe(0);
});

test('chatbots.utils.calculateCml action', async () => {
  const easySolved = 10;
  const mediumSolved = 8;
  const hardSolved = 13;

  // Valid: Check with regular values
  constants.CML = {
    EASY_POINTS: 1,
    MEDIUM_POINTS: 2,
    HARD_POINTS: 3,
  };
  const cml1 = calculateCml(easySolved, mediumSolved, hardSolved);

  expect(cml1).toBe(65);

  // Valid: Check with updated values
  constants.CML = {
    EASY_POINTS: 5,
    MEDIUM_POINTS: 15,
    HARD_POINTS: 50,
  };
  const cml2 = calculateCml(easySolved, mediumSolved, hardSolved);

  expect(cml2).toBe(820);
});

test('chatbots.utils.getCmlFromUser action', async () => {
  // Valid: Check with regular values
  constants.CML = {
    EASY_POINTS: 1,
    MEDIUM_POINTS: 2,
    HARD_POINTS: 3,
  };
  const cmlForUser1 = getCmlFromUser(user1);
  // Default value for user1
  // Easy: 12312
  // Medium: 2321
  // Hard: 2231
  const calculatedCml1 = calculateCml(12312, 2321, 2231);

  expect(cmlForUser1).toBe(calculatedCml1);

  // Valid: Check with updated CML values
  constants.CML = {
    EASY_POINTS: 5,
    MEDIUM_POINTS: 15,
    HARD_POINTS: 50,
  };
  const cml2 = getCmlFromUser(user1);
  const calculatedCml2 = calculateCml(12312, 2321, 2231);

  expect(cml2).toBe(calculatedCml2);

  // Valid: Check with updated Problem values
  constants.CML = {
    EASY_POINTS: 1,
    MEDIUM_POINTS: 2,
    HARD_POINTS: 3,
  };

  const easySolved = 100;
  const mediumSolved = 200;
  const hardSolved = 300;
  const updatedUser1 = mockUserWithSolved(easySolved, mediumSolved, hardSolved);

  const cml3 = getCmlFromUser(updatedUser1);
  const calculatedCml3 = calculateCml(easySolved, mediumSolved, hardSolved);

  expect(cml3).toBe(calculatedCml3);
});

test('chatbots.utils.convertToCmlRating action', async () => {
  // Valid: Test with 10 users
  const userList = [];

  for (let i = 0; i < 10; i++) {
    const easySolved = Math.floor(Math.random() * 1000);
    const mediumSolved = Math.floor(Math.random() * 500);
    const hardSolved = Math.floor(Math.random() * 300);
    userList.push(mockUserWithSolved(easySolved, mediumSolved, hardSolved));
  }

  const userListSolved = userList.map((user) => user.solved);

  expect(userListSolved.sort()).toBe(userListSolved);
});
