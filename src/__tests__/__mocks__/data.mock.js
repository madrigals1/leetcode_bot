import {
  getLeetcodeProblemLink, getLeetcodeUsernameLink,
} from '../../leetcode/utils';
import constants from '../../utils/constants';

const users = [
  {
    name: 'Random User Name',
    link: getLeetcodeUsernameLink('random_username'),
    username: 'random_username',
    solved: 124,
    all: 1700,
    profile: {
      userAvatar: 'https://example.com/random_link',
    },
    submissions: [
      {
        link: getLeetcodeProblemLink('random_problem_slug'),
        status: constants.STATUS_MAP.Accepted,
        language: 'cpp',
        name: 'Random Problem Name',
        time: '10 minutes ago',
      },
      {
        link: getLeetcodeProblemLink('random_problem_slug_2'),
        status: constants.STATUS_MAP['Runtime Error'],
        language: 'python',
        name: 'Random Problem Name 2',
        time: '2 weeks ago',
      },
    ],
  },
  {
    name: 'Random User Name 2',
    link: getLeetcodeUsernameLink('random_username_2'),
    username: 'random_username_2',
    solved: 752,
    all: 1700,
    profile: {
      userAvatar: 'https://example.com/random_link_2',
    },
    submissions: [
      {
        link: getLeetcodeProblemLink('random_problem_slug_3'),
        status: constants.STATUS_MAP.Accepted,
        language: 'java',
        name: 'Random Problem Name 3',
        time: '2 hours ago',
      },
      {
        link: getLeetcodeProblemLink('random_problem_slug_4'),
        status: constants.STATUS_MAP['Runtime Error'],
        language: 'javascript',
        name: 'Random Problem Name 4',
        time: '9 hours ago',
      },
    ],
  },
];

export default users;
