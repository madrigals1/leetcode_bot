import { LBBUser } from '../../backend/models';
import { constants } from '../../globals/constants';

export const user1: LBBUser = {
  id: 1,
  username: 'random_username',
  solved: 3000,
  solved_cml: 5000,
  data: {
    exists: true,
    name: 'Random User Name',
    link: 'https://leetcode.com/random_username',
    username: 'random_username',
    solved: 124,
    all: 1700,
    profile: {
      userAvatar: 'https://example.com/random_link',
      aboutMe: 'Random info About Me!',
      company: 'Good Company',
      countryName: 'Good Country',
      ranking: 123,
      realName: 'John Doe',
      reputation: 100,
      school: 'Good School',
      skillTags: ['Skill 1', 'Skill 2'],
      starRating: 4.5,
      websites: ['https://example.com/random_website'],
    },
    computed: {
      submissions: [
        {
          link: 'https://leetcode.com/problems/random_problem_slug',
          status: constants.SUBMISSION_STATUS_MAP.Accepted,
          language: 'cpp',
          name: 'Random Problem Name',
          time: '10 minutes ago',
          memory: '14.1 MB',
          runtime: '28 ms',
        },
        {
          link: 'https://leetcode.com/problems/random_problem_slug_2',
          status: constants.SUBMISSION_STATUS_MAP['Runtime Error'],
          language: 'python',
          name: 'Random Problem Name 2',
          time: '2 weeks ago',
          memory: '14.0 MB',
          runtime: '24 ms',
        },
      ],
      problemsSolved: {
        easy: 1000,
        medium: 1000,
        hard: 1000,
        all: 3000,
        cumulative: 5000,
      },
    },
    contributions: {
      points: 1000,
      questionCount: 123,
      testcaseCount: 23,
    },
    contestData: {
      userContestRanking: {
        attendedContestsCount: 123,
        globalRanking: 123,
        rating: 123,
      },
      userContestRankingHistory: [
        {
          contest: {
            startTime: 123123131,
            title: 'Contest Name',
          },
          ranking: 123,
          rating: 123,
        },
      ],
    },
    submitStats: {
      acSubmissionNum: [
        {
          count: 12312,
          difficulty: 'Easy',
          submissions: 123,
        },
        {
          count: 2321,
          difficulty: 'Medium',
          submissions: 341,
        },
        {
          count: 2231,
          difficulty: 'Hard',
          submissions: 312,
        },
        {
          count: 12000,
          difficulty: 'All',
          submissions: 1000,
        },
      ],
      totalSubmissionNum: [
        {
          count: 12312,
          difficulty: 'Easy',
          submissions: 123,
        },
      ],
    },
  },
};

export const user2: LBBUser = {
  id: 2,
  username: 'random_username_2',
  solved: 4000,
  solved_cml: 6000,
  data: {
    exists: true,
    name: 'Random User Name 2',
    link: 'https://leetcode.com/random_username_2',
    username: 'random_username_2',
    solved: 752,
    all: 1700,
    profile: {
      userAvatar: 'https://example.com/random_link_2',
      aboutMe: 'Random info About Me!',
      company: 'Good Company',
      countryName: 'Good Country',
      ranking: 123,
      realName: 'John Doe',
      reputation: 100,
      school: 'Good School',
      skillTags: ['Skill 1', 'Skill 2'],
      starRating: 4.5,
      websites: ['https://example.com/random_website'],
    },
    computed: {
      submissions: [
        {
          link: 'https://leetcode.com/problems/random_problem_slug_3',
          status: constants.SUBMISSION_STATUS_MAP.Accepted,
          language: 'java',
          name: 'Random Problem Name 3',
          time: '2 hours ago',
          memory: '13.4 MB',
          runtime: '44 ms',
        },
        {
          link: 'https://leetcode.com/problems/random_problem_slug_4',
          status: constants.SUBMISSION_STATUS_MAP['Runtime Error'],
          language: 'javascript',
          name: 'Random Problem Name 4',
          time: '9 hours ago',
          memory: '13.8 MB',
          runtime: '40 ms',
        },
      ],
      problemsSolved: {
        easy: 2000,
        medium: 1000,
        hard: 1000,
        all: 4000,
        cumulative: 6000,
      },
    },
    contributions: {
      points: 1000,
      questionCount: 123,
      testcaseCount: 23,
    },
    contestData: {
      userContestRanking: {
        attendedContestsCount: 123,
        globalRanking: 123,
        rating: 123,
      },
      userContestRankingHistory: [
        {
          contest: {
            startTime: 123123131,
            title: 'Contest Name',
          },
          ranking: 123,
          rating: 123,
        },
      ],
    },
    submitStats: {
      acSubmissionNum: [
        {
          count: 12315,
          difficulty: 'Easy',
          submissions: 125,
        },
        {
          count: 2325,
          difficulty: 'Medium',
          submissions: 345,
        },
        {
          count: 2235,
          difficulty: 'Hard',
          submissions: 315,
        },
        {
          count: 12005,
          difficulty: 'All',
          submissions: 1005,
        },
      ],
      totalSubmissionNum: [
        {
          count: 12312,
          difficulty: 'Easy',
          submissions: 123,
        },
      ],
    },
  },
};

export const users: LBBUser[] = [user1, user2];
