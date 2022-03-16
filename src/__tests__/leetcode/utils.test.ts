import { user1 } from '../__mocks__/data.mock';
import { mockUserWithSolved } from '../__mocks__/utils.mock';
import {
  calculateCml,
  getProblemsSolved,
  getGraphqlLink,
  getLeetcodeUsernameLink,
  getLeetcodeProblemLink,
  getRecentSubmissions,
  getCmlFromUser,
  getCmlFromUsers,
} from '../../leetcode/utils';
import { constants } from '../../utils/constants';
import { RecentSubmissionList, User } from '../../leetcode/models';

const { CML, SYSTEM } = constants;

beforeEach(() => {
  // Fix changed values before each test case
  constants.CML = CML;
  constants.SYSTEM = SYSTEM;
});

function updateCmlAndUsername(
  user: User, username: string, cumulative: number,
) {
  return {
    ...user,
    username,
    computed: {
      ...user.computed,
      problemsSolved: {
        ...user.computed.problemsSolved,
        cumulative,
      },
    },
  };
}

test('leetcode.utils.getLeetcodeUsernameLink action', async () => {
  // Valid: Regular Case
  const leetcodeUrl = SYSTEM.LEETCODE_URL;
  const username1 = 'test_username1';
  const link1 = getLeetcodeUsernameLink(username1);

  expect(link1).toBe(`${leetcodeUrl}/${username1}`);

  // Valid: Updated Case
  const randomUrl = 'random_url';
  const username2 = 'test_username2';
  constants.SYSTEM.LEETCODE_URL = randomUrl;
  const link2 = getLeetcodeUsernameLink(username2);

  expect(link2).toBe(`${randomUrl}/${username2}`);
});

test('leetcode.utils.getLeetcodeProblemLink action', async () => {
  // Valid: Regular Case
  const leetcodeUrl = SYSTEM.LEETCODE_URL;
  const title1 = 'test_title1';
  const link1 = getLeetcodeProblemLink(title1);

  expect(link1).toBe(`${leetcodeUrl}/problems/${title1}`);

  // Valid: Updated Case
  const randomUrl = 'random_url';
  const title2 = 'test_title2';
  constants.SYSTEM.LEETCODE_URL = randomUrl;
  const link2 = getLeetcodeProblemLink(title2);

  expect(link2).toBe(`${randomUrl}/problems/${title2}`);
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

test('leetcode.utils.getRecentSubmissions action', async () => {
  const recentSubmissionList: RecentSubmissionList = {
    languageList: [
      {
        id: 10,
        name: 'python',
        verboseName: 'Python',
      },
      {
        id: 12,
        name: 'javascript',
        verboseName: 'Javascript',
      },
      {
        id: 18,
        name: 'csharp',
        verboseName: 'C#',
      },
    ],
    recentSubmissionList: [
      {
        lang: 'python',
        statusDisplay: 'Time Limit Exceeded',
        time: '1 day',
        title: 'Submission Name 1',
        titleSlug: 'submission-name-1',
        memory: '13.5 MB',
        runtime: '58 ms',
      },
      {
        lang: 'javascript',
        statusDisplay: 'Accepted',
        time: '2 days',
        title: 'Submission Name 2',
        titleSlug: 'submission-name-2',
        memory: '13.8 MB',
        runtime: '84 ms',
      },
      {
        lang: 'csharp',
        statusDisplay: 'Memory Limit Exceeded',
        time: '3 days',
        title: 'Submission Name 3',
        titleSlug: 'submission-name-3',
        memory: '14.1 MB',
        runtime: '40 ms',
      },
    ],
  };

  const submissionData = getRecentSubmissions(recentSubmissionList);
  const submissionNode1 = submissionData[0];
  const submissionNode2 = submissionData[1];
  const submissionNode3 = submissionData[2];

  // Check Submission 1
  expect(submissionNode1.link)
    .toBe(getLeetcodeProblemLink('submission-name-1'));
  expect(submissionNode1.status)
    .toBe(constants.SUBMISSION_STATUS_MAP['Time Limit Exceeded']);
  expect(submissionNode1.language).toBe('Python');
  expect(submissionNode1.name).toBe('Submission Name 1');
  expect(submissionNode1.memory).toBe('13.5 MB');
  expect(submissionNode1.runtime).toBe('58 ms');

  // Check Submission 2
  expect(submissionNode2.link)
    .toBe(getLeetcodeProblemLink('submission-name-2'));
  expect(submissionNode2.status)
    .toBe(constants.SUBMISSION_STATUS_MAP.Accepted);
  expect(submissionNode2.language).toBe('Javascript');
  expect(submissionNode2.name).toBe('Submission Name 2');
  expect(submissionNode2.memory).toBe('13.8 MB');
  expect(submissionNode2.runtime).toBe('84 ms');

  // Check Submission 3
  expect(submissionNode3.link)
    .toBe(getLeetcodeProblemLink('submission-name-3'));
  expect(submissionNode3.status)
    .toBe(constants.SUBMISSION_STATUS_MAP['Memory Limit Exceeded']);
  expect(submissionNode3.language).toBe('C#');
  expect(submissionNode3.name).toBe('Submission Name 3');
  expect(submissionNode3.memory).toBe('14.1 MB');
  expect(submissionNode3.runtime).toBe('40 ms');
});

test('leetcode.utils.getCmlFromUser action', async () => {
  // Check first cml
  const cml1 = 1400;
  const userUpdated1 = updateCmlAndUsername(user1, user1.username, cml1);
  const cmlText1 = getCmlFromUser(userUpdated1);
  expect(cmlText1).toBe(`<b>${user1.username}</b> ${cml1}`);

  // Check second cml
  const cml2 = 7454265;
  const userUpdated2 = updateCmlAndUsername(user1, user1.username, cml2);
  const cmlText2 = getCmlFromUser(userUpdated2);
  expect(cmlText2).toBe(`<b>${user1.username}</b> ${cml2}`);
});

test('leetcode.utils.getCmlFromUsers action', async () => {
  /* Create users */
  const cml1 = 1230;
  const username1 = 'gus';
  const userUpdated1 = updateCmlAndUsername(user1, username1, cml1);

  const cml2 = 1300;
  const username2 = 'sentinel';
  const userUpdated2 = updateCmlAndUsername(user1, username2, cml2);

  const cml3 = 1250;
  const username3 = 'malek';
  const userUpdated3 = updateCmlAndUsername(user1, username3, cml3);

  const cml4 = 0;
  const username4 = 'nikola';
  const userUpdated4 = updateCmlAndUsername(user1, username4, cml4);

  const cml5 = 451213;
  const username5 = 'gogen';
  const userUpdated5 = updateCmlAndUsername(user1, username5, cml5);

  const usersUpdated = [
    userUpdated1, userUpdated2, userUpdated3, userUpdated4, userUpdated5,
  ];

  const cmlTextWhole = getCmlFromUsers(usersUpdated);
  const cmlTextArray = cmlTextWhole.split('\n');

  // Check CML index
  cmlTextArray.forEach((cmlText, index) => {
    const cmlIndex = cmlText.split(' ')[0];
    expect(cmlIndex).toBe(`${index + 1}.`);
  });

  const cmlTextContents = cmlTextArray.map((cmlText) => {
    const parts = cmlText.split(' ');
    return [parts[1], Number(parts[2])];
  });

  // Check each row directly
  expect(cmlTextContents[0]).toStrictEqual([`<b>${username5}</b>`, cml5]);
  expect(cmlTextContents[1]).toStrictEqual([`<b>${username2}</b>`, cml2]);
  expect(cmlTextContents[2]).toStrictEqual([`<b>${username3}</b>`, cml3]);
  expect(cmlTextContents[3]).toStrictEqual([`<b>${username1}</b>`, cml1]);
  expect(cmlTextContents[4]).toStrictEqual([`<b>${username4}</b>`, cml4]);
});
