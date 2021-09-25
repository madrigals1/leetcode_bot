/* eslint-disable no-console */
import { user1, user2 } from '../__mocks__/data.mock';
import { getCompareDataFromUser, compareMenu } from '../../chatbots/utils';
import dictionary from '../../utils/dictionary';
import { isValidHttpUrl } from '../../utils/helper';
import constants from '../../utils/constants';

beforeEach(() => {
  //
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
  // Get compare data from users
  const compareResponse = await compareMenu(user1, user2);

  // Check correct response
  expect(console.log)
    .toHaveBeenCalledWith(dictionary.SERVER_MESSAGES.IMAGE_WAS_CREATED);
  expect(isValidHttpUrl(compareResponse.link)).toBe(true);
  expect(compareResponse.error).toBe(undefined);
  expect(compareResponse.reason).toBe(undefined);

  // Get compare data from user
  constants.VIZAPI_LINK = 'incorrect_url';
  const compareResponseFailure = await compareMenu(user1, user2);

  // Check incorrect response
  expect(console.log).toHaveBeenCalled();
  expect(compareResponseFailure.error === undefined).toBe(false);
  expect(compareResponseFailure.reason)
    .toBe(dictionary.SERVER_MESSAGES.API_NOT_WORKING);
});
