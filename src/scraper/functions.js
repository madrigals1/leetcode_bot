import axios from 'axios';
import cheerio from 'cheerio';
import { LEETCODE_URL } from '../utils/constants';

async function getLeetcodeDataFromUsername(username) {
  return await axios.get(LEETCODE_URL + username).then(
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
        solved: parseInt(solved.trim()),
        all: parseInt(all.trim()),
      };
    },
    (err) => {
      console.log('Error on the server: ' + err);
      return null;
    },
  );
}

export { getLeetcodeDataFromUsername };
