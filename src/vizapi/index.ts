import axios from 'axios';

import { constants } from '../utils/constants';
import { log, error } from '../utils/helper';
import { User } from '../leetcode/models';
import {
  ErrorMessages,
  ImageMessages,
  UserMessages,
} from '../global/messages';

import { VizapiResponse, CompareUser } from './models';

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
  leftUser: User,
  rightUser: User,
): Promise<VizapiResponse> {
  return axios
    .post(`${constants.VIZAPI_LINK}/compare`, {
      left: getCompareDataFromUser(leftUser),
      right: getCompareDataFromUser(rightUser),
    })
    .then((res) => {
      log(ImageMessages.imageWasCreated);
      return { link: res.data.link };
    })
    .catch((err) => {
      error(ImageMessages.imageWasNotCreated(err));
      return { error: err, reason: 'api_not_working' };
    });
}

export async function tableForSubmissions(
  user?: User,
): Promise<VizapiResponse> {
  if (!user) {
    const errorMessage = 'Username not found';
    return new Promise((resolve) => {
      resolve({
        error: errorMessage,
        reason: ErrorMessages.server(errorMessage),
      });
    });
  }

  const userSubmissionData = user.computed.submissions.map((submission) => ({
    Name: submission.name,
    Time: submission.time,
    Language: submission.language,
    Status: submission.status,
    Memory: submission.memory,
    Runtime: submission.runtime,
  }));

  return axios
    .post(`${constants.VIZAPI_LINK}/table`, { table: userSubmissionData })
    .then((res) => {
      log(ImageMessages.imageWasCreated);
      const errorMsg = 'Please, provide non-empty \'table\' in request body';
      if (res.data.failure === errorMsg) {
        return {
          error: UserMessages.userHasNoSubmissions(user.username),
          reason: 'no_submissions',
        };
      }
      return { link: res.data.link };
    })
    .catch((err) => {
      error(ImageMessages.imageWasNotCreated(err));
      return { error: err, reason: 'api_not_working' };
    });
}

export async function solvedProblemsChart(user: User): Promise<VizapiResponse> {
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
      log(ImageMessages.imageWasCreated);
      return { link: res.data.link };
    })
    .catch((err) => {
      error(ImageMessages.imageWasNotCreated(err));
      return { error: err, reason: 'api_not_working' };
    });
}

export async function ratingGraph(users: User[]): Promise<VizapiResponse> {
  const usersUpdated = users
    .sort((user1: User, user2: User) => {
      const user1solved = user1.solved ?? -Infinity;
      const user2solved = user2.solved ?? -Infinity;
      return user2solved - user1solved;
    })
    .map((user) => {
      const { easy, medium, hard } = user.computed.problemsSolved;
      return [user.username, easy, medium, hard, user.solved];
    });

  // Calculate height
  const paddingHeight = 100;
  const chartHeight = users.length * 50;
  const fullHeight = paddingHeight + chartHeight;

  // Calculate width
  const paddingWidth = 100;
  const chartWidth = 500;
  const fullWidth = chartWidth + paddingWidth;

  return axios
    .post(`${constants.VIZAPI_LINK}/bar`, {
      data: [
        [
          'Difficulty',
          'Easy',
          'Medium',
          'Hard',
          {
            role: 'annotation',
          },
        ],
        ...usersUpdated,
      ],
      options: {
        titlePosition: 'none',
        width: fullWidth,
        height: fullHeight,
        legend: {
          position: 'top',
          maxLines: 3,
        },
        chartArea: {
          left: 175,
          height: chartHeight,
          width: chartWidth,
        },
        annotations: { alwaysOutside: true },
        bar: {
          groupWidth: '50%',
        },
        isStacked: true,
        colors: ['#43A047', '#FB8C00', '#E91E63', 'black'],
      },
    })
    .then((res) => {
      log(ImageMessages.imageWasCreated);
      return { link: res.data.link };
    })
    .catch((err) => {
      error(ImageMessages.imageWasNotCreated(err));
      return { error: err, reason: 'api_not_working' };
    });
}
