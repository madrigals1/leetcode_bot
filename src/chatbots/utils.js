import axios from 'axios';

import constants from '../utils/constants';
import { log, error } from '../utils/helper';
import dictionary from '../utils/dictionary';

export const tableForSubmissions = (user) => axios
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

export const createUserListReplyMarkup = (options) => {
  // Get all variables from context
  const {
    isOnlyHeader, users, header, footer, command,
  } = options;

  // Create menu for users
  const usersInlineKeyboard = [];

  // If only header is needed to be returned
  if (isOnlyHeader) {
    // Add header
    usersInlineKeyboard.push([{
      text: header,
      callback_data: command,
    }]);

    return JSON.stringify({ inline_keyboard: usersInlineKeyboard });
  }

  for (let i = 0; i < Math.ceil(users.length / 3); i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      const index = (i * 3) + j;
      if (index < users.length) {
        const user = users[index];
        row.push({
          text: `${user.username}`,
          callback_data: `${command} ${user.username}`,
        });
      }
    }
    usersInlineKeyboard.push(row);
  }

  // Button for closing Keyboard Menu
  usersInlineKeyboard.push([{
    text: footer,
    callback_data: 'placeholder',
  }]);

  return JSON.stringify({ inline_keyboard: usersInlineKeyboard });
};
