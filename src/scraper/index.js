const axios = require('axios');
const cheerio = require('cheerio');
const { LEETCODE_URL, SUBMISSION_COUNT, STATUS_MAP } = require('../utils/constants');
const { SERVER_MESSAGES } = require('../utils/dictionary');
const { error } = require('../utils/helper');

async function getLeetcodeDataFromUsername(username) {
  const leetcodeLink = `${LEETCODE_URL}/${username}`;
  return axios.get(leetcodeLink).then(
    (response) => {
      const $ = cheerio.load(response.data);
      const body = $('body');
      const row = body
        .find('div.row')
        .first()
        .find('.panel-default');

      const avatar = row
        .eq(0)
        .find('.panel-body')
        .find('img')
        .attr('src');

      const [solved, all] = row
        .eq(2)
        .find('ul > li')
        .eq(0)
        .find('span')
        .text()
        .split('/');

      const lastPanel = row.last();
      const lastPanelHeading = lastPanel.find('.panel-title').text().trim();

      // If the panel is not Most Recent Submissions, ignore
      const submissionsDOM = lastPanelHeading === SERVER_MESSAGES.MOST_RECENT_SUBMISSIONS
        ? row.last().find('.list-group-item') : [];
      const submissions = [];

      for (let i = 0; i < Math.min(submissionsDOM.length, SUBMISSION_COUNT); i++) {
        const sdom = submissionsDOM.eq(i);
        const spans = sdom.find('span');
        const status = spans.eq(0).text().trim();
        submissions.push({
          link: sdom.attr('href'),
          status: STATUS_MAP[status],
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
        avatar,
        submissions,
      };
    },
    (err) => {
      error(SERVER_MESSAGES.ERROR_ON_THE_SERVER(err));
      return null;
    },
  );
}

module.exports = { getLeetcodeDataFromUsername };
