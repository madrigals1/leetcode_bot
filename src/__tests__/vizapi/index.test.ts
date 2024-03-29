/* eslint-disable camelcase */
/* eslint-disable no-console */
import { user1, user2 } from '../__mocks__/data.mock';
import {
  getCompareDataFromUser,
  compareMenu,
  tableForSubmissions,
} from '../../vizapi';
import { isValidHttpUrl } from '../../utils/helper';
import { constants } from '../../global/constants';

const { VIZAPI_LINK } = constants;

beforeEach(() => {
  // Fix changed values before each test case
  constants.VIZAPI_LINK = VIZAPI_LINK;
});

afterEach(() => {
  //
});

test('vizapi.utils.getCompareDataFromUser action', async () => {
  // Get compare data from user
  const compareData = getCompareDataFromUser(user1);

  // Compare fields
  expect(compareData.image).toBe(user1.profile!.userAvatar);

  compareData.bio_fields.forEach(({ name, value }) => {
    switch (name) {
      case 'Name':
        expect(value).toBe(user1.name);
        break;
      case 'Username':
        expect(value).toBe(user1.username);
        break;
      case 'Location':
        expect(value).toBe(user1.profile!.countryName);
        break;
      case 'Company':
        expect(value).toBe(user1.profile!.company);
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
          .toBe(Math.round(user1.contestData!.userContestRanking?.rating));
        break;
      case 'Location':
        expect(value)
          .toBe(user1.submitStats!.totalSubmissionNum[0].submissions);
        break;
      case 'Company':
        expect(value).toBe(user1.contributions!.points);
        break;

      default:
        break;
    }
  });

  expect(compareData.image).toBe(user1.profile!.userAvatar);
});

test('vizapi.utils.* confirm URL', async () => {
  expect(constants.VIZAPI_LINK).not.toBe('');
  expect(constants.VIZAPI_LINK).toBe('https://vizapi.madrigal.pro');
});

test('vizapi.utils.compareMenu action', async () => {
  // Valid
  const compareResponse = await compareMenu(user1, user2);

  expect(console.log).toHaveBeenCalledWith('The image was created');
  expect(compareResponse.link).toBeDefined();
  expect(isValidHttpUrl(compareResponse.link!)).toBe(true);
  expect(compareResponse.error).toBe(undefined);
  expect(compareResponse.reason).toBe(undefined);

  // Invalid: Invalid url
  constants.VIZAPI_LINK = 'incorrect_url';
  const compareResponseFailure = await compareMenu(user1, user2);

  expect(console.log).toHaveBeenCalled();
  expect(compareResponseFailure.error === undefined).toBe(false);
  expect(compareResponseFailure.reason).toBe('api_not_working');
});

test('vizapi.utils.tableForSubmissions action', async () => {
  // Valid
  const tableForSubmissionsResponse = await tableForSubmissions(user1);

  expect(console.log).toHaveBeenCalledWith('The image was created');
  expect(tableForSubmissionsResponse.link).toBeDefined();
  expect(isValidHttpUrl(tableForSubmissionsResponse.link!)).toBe(true);
  expect(tableForSubmissionsResponse.error).toBe(undefined);
  expect(tableForSubmissionsResponse.reason).toBe(undefined);

  // Invalid: User is not sent
  const compareResponseFailure1 = await tableForSubmissions(undefined);

  expect(console.log).toHaveBeenCalled();
  expect(compareResponseFailure1.error).toBe('Username not found');
  expect(compareResponseFailure1.reason)
    .toBe('❗ Error on the server: Username not found');

  // Invalid: User has no submissions
  const userWithoutSubmissions = {
    ...user1,
    computed: {
      submissions: [],
      problemsSolved: user1.computed!.problemsSolved,
    },
  };
  const compareResponseFailure2 = (
    await tableForSubmissions(userWithoutSubmissions)
  );
  const dictMessageWithoutSubmissions = (
    `❗ User <b>${userWithoutSubmissions.username!}</b> does not have any `
    + 'submissions'
  );

  expect(console.log).toHaveBeenCalled();
  expect(compareResponseFailure2.error).toBe(dictMessageWithoutSubmissions);
  expect(compareResponseFailure2.reason).toBe('no_submissions');

  // Invalid: Incorrect URL
  constants.VIZAPI_LINK = 'incorrect_url';
  const compareResponseFailure3 = await tableForSubmissions(user1);

  expect(console.log).toHaveBeenCalled();
  expect(compareResponseFailure3.error === undefined).toBe(false);
  expect(compareResponseFailure3.reason).toBe('api_not_working');
});
