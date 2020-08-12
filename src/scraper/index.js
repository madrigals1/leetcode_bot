const axios = require('axios');
const cheerio = require('cheerio');
const { LEETCODE_URL, SUBMISSION_COUNT, DICT } = require('../utils/constants');
const { error } = require('../utils/helper');

async function getLeetcodeDataFromUsername(username) {
  const leetcodeLink = `${LEETCODE_URL}${username}`;
  return axios.get(leetcodeLink).then(
    (response) => {
      const $ = cheerio.load(response.data);
      const body = $('body');
      const row = body
        .find('div.row')
        .first()
        .find('.panel-default');

      const [solved, all] = row
        .eq(2)
        .find('ul > li')
        .eq(0)
        .find('span')
        .text()
        .split('/');

      const submissionsDOM = row.last().find('.list-group-item');
      const submissions = [];

      for (let i = 0; i < Math.min(submissionsDOM.length, SUBMISSION_COUNT); i++) {
        const sdom = submissionsDOM.eq(i);
        const spans = sdom.find('span');
        submissions.push({
          link: sdom.attr('href'),
          status: spans.eq(0).text().trim(),
          language: spans.eq(1).text().trim(),
          name: sdom.find('b').text().trim(),
          time: spans.eq(2).text().trim(),
        });
      }

      return {
        name: body.find('.realname').attr('title'),
        link: leetcodeLink,
        username: body.find('.username').attr('title'),
        solved: parseInt(solved.trim(), 10),
        all: parseInt(all.trim(), 10),
        submissions,
      };
    },
    (err) => {
      error(`${DICT.STATUS.ERROR.ON_THE_SERVER} ${err}`);
      return {
        name: DICT.STATUS.ERROR.DEFAULT,
        username: DICT.STATUS.ERROR.DEFAULT,
        solved: 0,
        all: 0,
      };
    },
  );
}

module.exports = { getLeetcodeDataFromUsername };
