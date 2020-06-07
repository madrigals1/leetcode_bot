const axios = require('axios');
const cheerio = require('cheerio');
const { LEETCODE_URL, SUBMISSION_COUNT } = require('../utils/constants');
const { error } = require('../utils/helper');

async function getLeetcodeDataFromUsername(username) {
  return axios.get(LEETCODE_URL + username).then(
    (response) => {
      const $ = cheerio.load(response.data);
      const body = $('body');
      const row = body
        .find('div.row')
        .first()
        .find('.panel-default');

      const realname = body.find('.realname').attr('title');

      const [solved, all] = row
        .eq(2)
        .find('ul > li')
        .eq(0)
        .find('span')
        .text()
        .split('/');

      const submissionsDOM = row
        .eq(7)
        .find('.list-group-item');

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
        name: realname,
        link: `https://leetcode.com/${realname}`,
        username: body.find('.username').attr('title'),
        solved: parseInt(solved.trim(), 10),
        all: parseInt(all.trim(), 10),
        submissions,
      };
    },
    (err) => {
      error(`Error on the server: ${err}`);
      return {
        name: 'Error',
        username: 'Error',
        solved: 0,
        all: 0,
      };
    },
  );
}

module.exports = { getLeetcodeDataFromUsername };
