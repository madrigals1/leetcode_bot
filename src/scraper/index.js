const axios = require('axios');
const cheerio = require('cheerio');
const { LEETCODE_URL } = require('../utils/constants');

async function getLeetcodeDataFromUsername(username) {
  return axios.get(LEETCODE_URL + username).then(
    (response) => {
      const $ = cheerio.load(response.data);
      const body = $('body');
      const [solved, all] = body
        .find('#base_content > div.response-container > div')
        .first()
        .find('.panel-default')
        .eq(2)
        .find('ul > li')
        .eq(0)
        .find('span')
        .text()
        .split('/');
      return {
        name: body.find('.realname').attr('title'),
        username: body.find('.username').attr('title'),
        solved: parseInt(solved.trim(), 10),
        all: parseInt(all.trim(), 10),
      };
    },
    (err) => {
      console.log(`Error on the server: ${err}`);
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
