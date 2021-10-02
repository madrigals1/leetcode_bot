import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import * as relativeTime from 'dayjs/plugin/relativeTime';

import constants from '../utils/constants';

import {
  LanguageNode,
  RecentSubmissionList,
  SubmissionData,
  SubmissionDumpNode,
  SubmissionsCountNode,
  UserProblemsSolvedData,
} from './models';

const { LEETCODE_URL } = constants.SYSTEM;

dayjs.extend(duration);
dayjs.extend(relativeTime);

export function getLeetcodeUsernameLink(username: string): string {
  return `${LEETCODE_URL}/${username}`;
}

export function getLeetcodeProblemLink(title: string): string {
  return `${LEETCODE_URL}/problems/${title}`;
}

export function getGraphqlLink(): string {
  return `${LEETCODE_URL}/graphql`;
}

export function getRecentSubmissions(
  submissionData: RecentSubmissionList,
): SubmissionData[] {
  const now: number = dayjs().unix();
  return submissionData.recentSubmissionList.map(
    (submission: SubmissionDumpNode) => {
      const unixTime: number = parseInt(submission.timestamp, 10);

      return {
        link: getLeetcodeProblemLink(submission.titleSlug),
        status: constants.SUBMISSION_STATUS_MAP[submission.statusDisplay],
        language: submissionData.languageList.find((language: LanguageNode) => (
          language.name === submission.lang
        )).verboseName,
        name: submission.title,
        time: dayjs.duration((unixTime - now) * 1000).humanize(true),
      };
    },
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
    easySolvedCount, mediumSolvedCount, hardSolvedCount,
  );

  return {
    easy: easySolvedCount,
    medium: mediumSolvedCount,
    hard: hardSolvedCount,
    all: allSolvedCount,
    cumulative: cumulativeSolvedCount,
  };
}
