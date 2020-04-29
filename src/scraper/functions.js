const axios = require('axios');
const cheerio = require('cheerio');

async function getLeetcodeDataFromUsername(username) {
    return axios('https://leetcode.com/' + username)
        .then((response) => {
            const $ = cheerio.load(response.data);
            const body = $('body');
            const [solved, all] = body.find('#base_content > div.response-container > div')
                .first().find('.panel-default').eq(2)
                .find('ul > li').eq(0).find('span').text().split("/");
            return {
                name: body.find('.realname').attr('title'),
                username: body.find('.username').attr('title'),
                solved: solved.trim(),
                all: all.trim()
            }
        })
        .catch((e) => {
            console.log('Error on the server: ' + e);
            return null;
        });
}

module.exports = { getLeetcodeDataFromUsername };