import axios from 'axios';

import constants from '../utils/constants';
import { log, error } from '../utils/helper';
import dictionary from '../utils/dictionary';
import { User } from '../leetcode/models';
import Cache from '../cache';

import {
  TableResponse,
  CompareUser,
  Button,
  ButtonOptions,
} from './models';
import { ButtonContainer } from './models/buttons.model';

const { SERVER_MESSAGES: SM, BOT_MESSAGES: BM } = dictionary;

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
      log(SM.IMAGE_WAS_CREATED);
      return { link: res.data.link };
    })
    .catch((err) => {
      error(SM.IMAGE_WAS_NOT_CREATED(err));
      return { error: err, reason: SM.API_NOT_WORKING };
    });
}

export async function tableForSubmissions(user: User): Promise<TableResponse> {
  if (!user) {
    const errorMessage = 'Username not found';
    return new Promise((resolve) => resolve({
      error: errorMessage,
      reason: SM.ERROR_ON_THE_SERVER(errorMessage),
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
      log(SM.IMAGE_WAS_CREATED);
      const errorMsg = 'Please, provide non-empty \'table\' in request body';
      if (res.data.failure === errorMsg) {
        return {
          error: BM.USER_NO_SUBMISSIONS(user.username),
          reason: SM.NO_SUBMISSIONS,
        };
      }
      return { link: res.data.link };
    })
    .catch((err) => {
      error(SM.IMAGE_WAS_NOT_CREATED(err));
      return { error: err, reason: SM.API_NOT_WORKING };
    });
}

export function createButtonsFromUsers(
  options: ButtonOptions,
): Button[] {
  const { action, password } = options;

  // Get all user from Cache and create Button for each
  const buttons = Cache.allUsers().map((user: User) => ({
    text: user.username,
    action: `/${action} ${user.username} ${password || ''}`,
  }));

  return buttons;
}

export function getCloseButton(): ButtonContainer {
  return {
    buttons: [{
      text: `${constants.EMOJI.CROSS_MARK} Close`,
      action: 'placeholder',
    }],
    buttonPerRow: 1,
  };
}
