import { constants } from '../utils/constants';

import {
  LanguageNode,
  RecentSubmissionList,
  SubmissionData,
  SubmissionDumpNode,
  SubmissionsCountNode,
  User,
  UserProblemsSolvedData,
} from './models';

export function getLeetcodeUsernameLink(username: string): string {
  return `${constants.SYSTEM.LEETCODE_URL}/${username}`;
}

export function getLeetcodeProblemLink(title: string): string {
  return `${constants.SYSTEM.LEETCODE_URL}/problems/${title}`;
}

export function getGraphqlLink(): string {
  return `${constants.SYSTEM.LEETCODE_URL}/graphql`;
}

export function getRecentSubmissions(
  data: RecentSubmissionList,
): SubmissionData[] {
  return data.recentSubmissionList.map(
    (submission: SubmissionDumpNode) => ({
      link: getLeetcodeProblemLink(submission.titleSlug),
      status: constants.SUBMISSION_STATUS_MAP[submission.statusDisplay],
      language: data.languageList.find((language: LanguageNode) => (
        language.name === submission.lang
      )).verboseName,
      name: submission.title,
      time: `${submission.time} ago`,
      memory: submission.memory,
      runtime: submission.runtime,
    }),
  );
}

export function calculateCml(
  easySolvedCount: number,
  mediumSolvedCount: number,
  hardSolvedCount: number,
): number {
  return (easySolvedCount * constants.CML.EASY_POINTS)
    + (mediumSolvedCount * constants.CML.MEDIUM_POINTS)
    + (hardSolvedCount * constants.CML.HARD_POINTS);
}

export function getProblemsSolved(
  submissions: SubmissionsCountNode[],
): UserProblemsSolvedData {
  // Get submissions for different difficulty levels
  const easySolvedCount = submissions
    .find((sc) => sc.difficulty === 'Easy')
    .count;
  const mediumSolvedCount = submissions
    .find((sc) => sc.difficulty === 'Medium')
    .count;
  const hardSolvedCount = submissions
    .find((sc) => sc.difficulty === 'Hard')
    .count;

  // Get overall value for ratings
  const allSolvedCount = easySolvedCount + mediumSolvedCount + hardSolvedCount;
  const cumulativeSolvedCount = calculateCml(
    easySolvedCount,
    mediumSolvedCount,
    hardSolvedCount,
  );

  return {
    easy: easySolvedCount,
    medium: mediumSolvedCount,
    hard: hardSolvedCount,
    all: allSolvedCount,
    cumulative: cumulativeSolvedCount,
  };
}

export function getCmlFromUser(user: User): string {
  return `<b>${user.username}</b> ${user.computed.problemsSolved.cumulative}`;
}

export function getCmlFromUsers(users: User[]): string {
  const sortedUsers = users.sort((user1, user2) => {
    const cml1 = user1.computed.problemsSolved.cumulative;
    const cml2 = user2.computed.problemsSolved.cumulative;
    return cml2 - cml1;
  });

  return sortedUsers.map(
    (user, index) => (`${index + 1}. ${getCmlFromUser(user)}`),
  ).join('\n');
}
