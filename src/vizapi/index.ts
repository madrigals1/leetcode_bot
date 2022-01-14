import axios from 'axios';

import constants from '../utils/constants';
import { log, error } from '../utils/helper';
import dictionary from '../utils/dictionary';
import { User } from '../leetcode/models';

import { VizapiResponse, CompareUser } from './models';

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
): Promise<VizapiResponse> {
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

export async function tableForSubmissions(user: User): Promise<VizapiResponse> {
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

export async function solvedProblemsChart(
  user: User,
): Promise<VizapiResponse> {
  const { easy, medium, hard } = user.computed.problemsSolved;

  return axios
    .post(`${constants.VIZAPI_LINK}/pie`, {
      title: `Problems Solved by ${user.username}`,
      pieHole: 0.4,
      fontSize: 16,
      width: 600,
      height: 400,
      chartArea: {
        top: 25,
        left: 25,
        width: '100%',
        height: '100%',
      },
      sliceName: 'Difficulty',
      sliceValue: 'Problem count',
      sliceData: [
        {
          sliceName: 'Easy',
          sliceValue: easy,
          sliceColor: '#43A047',
        },
        {
          sliceName: 'Medium',
          sliceValue: medium,
          sliceColor: '#FB8C00',
        },
        {
          sliceName: 'Hard',
          sliceValue: hard,
          sliceColor: '#E91E63',
        },
      ],
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
