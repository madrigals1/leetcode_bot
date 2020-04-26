const dotenv = require('dotenv');
const TeleBot = require('telebot');
const axios = require('axios');
const cheerio = require('cheerio');

dotenv.config();
const bot = new TeleBot(process.env.TOKEN);
const users = [
    {
        link: 'almaz',
        username: 'pheonix97al',
    },
    {
        link: 'aibek',
        username: 'dmndcrow',
    },
    {
        link: 'nartay',
        username: 'zhanybekovv',
    },
    {
        link: 'sabyr',
        username: 'megasaab',
    }
];

async function getSolvedFromUsername (username) {
    const defaultData = await axios('https://leetcode.com/' + username)
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
            return { error: e };
        });
    console.log(defaultData);
    return defaultData;
}

const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1)
};

ratingText = users.map(user => '/' + user.link + ' Rating of ' + capitalize(user.link) + '\n').join('');
console.log(ratingText);

bot.on(['/start'], (msg) => msg.reply.text(
    'Welcome!\n' +
    ratingText
));

users.forEach(user => {
    bot.on(['/' + user.link], (msg) => {
        getSolvedFromUsername(user.username).then(data =>{
            const {name, username, solved, all, error} = data;
            if (error) {
                return msg.reply.text('Error is encountered: ' + error);
            }
            return msg.reply.text(
                'Name: ' + name + '\n' +
                'Username: ' + username + '\n' +
                'Solved: ' + solved + '\n' +
                'All: ' + all + '\n'
            );
        });
    });
});

bot.start();