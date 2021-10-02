import axios from 'axios';

import constants from '../utils/constants';
import { log, error } from '../utils/helper';
import dictionary from '../utils/dictionary';
import { User } from '../leetcode/models';
import Cache from '../cache';
import { UserProblemsSolvedData } from '../leetcode/models/user.model';
import { SubmissionsCountNode } from '../leetcode/models/profile.model';

import {
  ReplyMarkupOptions,
  TableResponse,
  CompareUser,
  ReplyMarkupCommand,
  ButtonOptions,
} from './models';

export function getCompareDataFromUser(user: User): CompareUser {
  return {
    image: user.profile.userAvatar,
    bio_fields: [
      {
        name: 'Name',
        value: user.name,
      },
      {
        name: 'Username',
        value: user.username,
      },
      {
        name: 'Location',
        value: user.profile.countryName,
      },
      {
        name: 'Company',
        value: user.profile.company,
      },
    ],
    compare_fields: [
      {
        name: 'Problems Solved',
        value: user.solved,
      },
      {
        name: 'Contest Rating',
        value: Math.round(user.contestData.userContestRanking?.rating),
      },
      {
        name: 'Total Submissions',
        value: user.submitStats.totalSubmissionNum[0].submissions,
      },
      {
        name: 'Points',
        value: user.contributions.points,
      },
    ],
  };
}

export async function compareMenu(
  leftUser: User, rightUser: User,
): Promise<TableResponse> {
  return axios
    .post(`${constants.VIZAPI_LINK}/compare`, {
      left: getCompareDataFromUser(leftUser),
      right: getCompareDataFromUser(rightUser),
    })
    .then((res) => {
      log(dictionary.SERVER_MESSAGES.IMAGE_WAS_CREATED);
      return { link: res.data.link };
    })
    .catch((err) => {
      error(dictionary.SERVER_MESSAGES.IMAGE_WAS_NOT_CREATED(err));
      return { error: err, reason: dictionary.SERVER_MESSAGES.API_NOT_WORKING };
    });
}

export async function tableForSubmissions(user: User): Promise<TableResponse> {
  if (!user) {
    const errorMessage = 'Username not found';
    return new Promise((resolve) => resolve({
      error: errorMessage,
      reason: dictionary.SERVER_MESSAGES.ERROR_ON_THE_SERVER(errorMessage),
    }));
  }

  const userSubmissionData = user.computed.submissions.map((submission) => ({
    Name: submission.name,
    Time: submission.time,
    Language: submission.language,
    Status: submission.status,
  }));

  return axios
    .post(`${constants.VIZAPI_LINK}/table`, { table: userSubmissionData })
    .then((res) => {
      log(dictionary.SERVER_MESSAGES.IMAGE_WAS_CREATED);
      const errorMsg = 'Please, provide non-empty \'table\' in request body';
      if (res.data.failure === errorMsg) {
        return {
          error: dictionary.BOT_MESSAGES.USER_NO_SUBMISSIONS(user.username),
          reason: dictionary.SERVER_MESSAGES.NO_SUBMISSIONS,
        };
      }
      return { link: res.data.link };
    })
    .catch((err) => {
      error(dictionary.SERVER_MESSAGES.IMAGE_WAS_NOT_CREATED(err));
      return { error: err, reason: dictionary.SERVER_MESSAGES.API_NOT_WORKING };
    });
}

export function generateReplyMarkup(options: ReplyMarkupOptions): string {
  const { buttons, isClosable } = options;

  // Inline keyboard
  const inlineKeyboard = [];

  // Make 3 buttons on each row
  for (let i = 0; i < Math.ceil(buttons.length / 3); i++) {
    const row = [];

    for (let j = 0; j < 3; j++) {
      const index = (i * 3) + j;

      if (index < buttons.length) {
        const button = buttons[index];
        row.push({ text: button.text, callback_data: button.action });
      }
    }

    inlineKeyboard.push(row);
  }

  // Add close button
  if (isClosable) {
    inlineKeyboard.push([{
      text: `${constants.EMOJI.CROSS_MARK} Close`,
      callback_data: 'placeholder',
    }]);
  }

  return JSON.stringify({ inline_keyboard: inlineKeyboard });
}

export function createButtonsFromUsers(
  options: ButtonOptions,
): ReplyMarkupCommand[] {
  const { action, password } = options;

  // Get all user from Cache and create Button for each
  const buttons = Cache.allUsers().map((user: User) => ({
    text: user.username,
    action: `/${action} ${user.username} ${password || ''}`,
  }));

  return buttons;
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
