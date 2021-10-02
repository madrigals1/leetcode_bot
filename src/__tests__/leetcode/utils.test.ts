import { user1 } from '../__mocks__/data.mock';
import { mockUserWithSolved } from '../__mocks__/utils.mock';
import {
  calculateCml,
  getProblemsSolved,
  getGraphqlLink,
} from '../../leetcode/utils';
import constants from '../../utils/constants';

const { CML, SYSTEM } = constants;

beforeEach(() => {
  // Fix changed values before each test case
  constants.CML = CML;
  constants.SYSTEM = SYSTEM;
});

test('leetcode.utils.getGraphqlLink action', async () => {
  // Valid: Regular Case
  const leetcodeUrl = SYSTEM.LEETCODE_URL;
  const link1 = getGraphqlLink();

  expect(link1).toBe(`${leetcodeUrl}/graphql`);

  // Valid: Updated Case
  const randomUrl = 'random_url';
  constants.SYSTEM.LEETCODE_URL = randomUrl;
  const link2 = getGraphqlLink();

  expect(link2).toBe(`${randomUrl}/graphql`);
});

test('leetcode.utils.calculateCml action', async () => {
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

test('leetcode.utils.getProblemsSolved action', async () => {
  // Valid: Check with regular values
  constants.CML = {
    EASY_POINTS: 1,
    MEDIUM_POINTS: 2,
    HARD_POINTS: 3,
  };
  const cmlForUser1 = getProblemsSolved(user1.submitStats.acSubmissionNum);
  // Default value for user1
  // Easy: 12312
  // Medium: 2321
  // Hard: 2231
  const calculatedCml1 = calculateCml(12312, 2321, 2231);

  expect(cmlForUser1.cumulative).toBe(calculatedCml1);

  // Valid: Check with updated CML values
  constants.CML = {
    EASY_POINTS: 5,
    MEDIUM_POINTS: 15,
    HARD_POINTS: 50,
  };
  const cml2 = getProblemsSolved(user1.submitStats.acSubmissionNum);
  const calculatedCml2 = calculateCml(12312, 2321, 2231);

  expect(cml2.cumulative).toBe(calculatedCml2);

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

  const cml3 = getProblemsSolved(updatedUser1.submitStats.acSubmissionNum);
  const calculatedCml3 = calculateCml(easySolved, mediumSolved, hardSolved);

  expect(cml3.cumulative).toBe(calculatedCml3);
});
