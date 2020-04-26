const TeleBot = require('telebot');
const bot = new TeleBot('1091477375:AAGYgqMHKKNfpKIA84wgaiRzGPv7bYaA6w8');
const axios = require('axios');
const cheerio = require('cheerio');

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

bot.on(['/start'], (msg) => msg.reply.text(
    'Welcome!\n' +
    '/rating Rating of Elite Boys\n' +
    '/aibek Rating of Aibek\n' +
    '/almaz Rating of Almaz\n' +
    '/nartay Rating of Nartay'
));

bot.on(['/aibek'], (msg) => {
    getSolvedFromUsername('dmndcrow').then(data =>{
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

bot.on(['/almaz'], (msg) => {
    getSolvedFromUsername('pheonix97al').then(data =>{
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

bot.on(['/nartay'], (msg) => {
    getSolvedFromUsername('zhanybekovv').then(data =>{
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

bot.start();