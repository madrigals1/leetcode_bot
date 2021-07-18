import axios from 'axios';

import constants from '../utils/constants';
import { log, error } from '../utils/helper';
import dictionary from '../utils/dictionary';
import { User } from '../leetcode/models';

import {
  ReplyMarkupOptions,
  TableResponse,
  CompareUser,
  ReplyMarkupCommand,
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

export function compareMenu(
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
      error(dictionary.SERVER_MESSAGES.IMAGE_WAS_NOT_CREATED);
      error(err);
      return { error: err, reason: dictionary.SERVER_MESSAGES.API_NOT_WORKING };
    });
}

export function tableForSubmissions(user: User): Promise<TableResponse> {
  if (!user) {
    const errorMessage = 'Username not found';
    return new Promise((resolve) => resolve({
      error: errorMessage,
      reason: dictionary.SERVER_MESSAGES.ERROR_ON_THE_SERVER(errorMessage),
    }));
  }

  return axios
    .post(`${constants.VIZAPI_LINK}/table`, {
      table: user.submissions.map((submission) => (
        {
          Name: submission.name,
          Time: submission.time,
          Language: submission.language,
          Status: submission.status,
        }
      )),
    })
    .then((res) => {
      log(dictionary.SERVER_MESSAGES.IMAGE_WAS_CREATED);
      if (res.data.detail === 'Please, provide \'table\' in request body') {
        return {
          error: dictionary.BOT_MESSAGES.USER_NO_SUBMISSIONS(user.username),
          reason: dictionary.SERVER_MESSAGES.NO_SUBMISSIONS,
        };
      }
      return { link: res.data.link };
    })
    .catch((err) => {
      error(dictionary.SERVER_MESSAGES.IMAGE_WAS_NOT_CREATED);
      error(err);
      return { error: err, reason: dictionary.SERVER_MESSAGES.API_NOT_WORKING };
    });
}

export function createUserListReplyMarkup(options: ReplyMarkupOptions): string {
  // Get users from context
  const { users } = options;

  // Create menu for users
  const usersInlineKeyboard = [];

  // If only header is needed to be returned
  if (options.isOnlyHeader) {
    // Add header
    usersInlineKeyboard.push([{
      text: options.header,
      callback_data: options.command,
    }]);

    return JSON.stringify({ inline_keyboard: usersInlineKeyboard });
  }

  for (let i = 0; i < Math.ceil(users.length / 3); i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      const index = (i * 3) + j;
      if (index < users.length) {
        const user = users[index];
        const dataWithoutPassword = `${options.command} ${user.username}`;
        const dataWithPassword = options.password
          ? `${dataWithoutPassword} ${options.password}`
          : `${dataWithoutPassword}`;

        row.push({
          text: `${user.username}`,
          callback_data: dataWithPassword,
        });
      }
    }
    usersInlineKeyboard.push(row);
  }

  // Button for closing Keyboard Menu
  usersInlineKeyboard.push([{
    text: options.footer,
    callback_data: 'placeholder',
  }]);

  return JSON.stringify({ inline_keyboard: usersInlineKeyboard });
}

export function generateReplyMarkup(buttons: ReplyMarkupCommand[]): string {
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

  return JSON.stringify({ inline_keyboard: inlineKeyboard });
}
