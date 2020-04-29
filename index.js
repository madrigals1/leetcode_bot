require('./src/config');
const TeleBot = require('telebot');

const Database = require('./src/database');
const { getLeetcodeDataFromUsername } = require("./src/scraper/functions");
const { capitalize } = require("./src/utils/helper");

const bot = new TeleBot(process.env.TOKEN);
let users = null;
let addedListeners = false;

function callbackForUser(msg, username) {
    Database.loadUser(username).then(data => {
        const {name, username, solved, error} = data;
        if (error) {
            return msg.reply.text('Error is encountered: ' + error);
        }
        return msg.reply.text(
            'Name: ' + name + '\n' +
            'Username: ' + username + '\n' +
            'Solved: ' + solved + '\n'
        );
    });
}

async function refreshUsers () {
    await Database.refreshUsers()
        .then(res => {
            users = res;
        })
        .catch(err => console.error(err));
    if (!addedListeners) {
        users.forEach(user => {
            bot.on(['/' + user.username.toLowerCase()], (msg) => callbackForUser(msg, user.username));
        });
        addedListeners = true;
    }
}

refreshUsers();

bot.on(['/start'], (msg) => {
    const ratingText = users ? users.map(user => '/' + user.username.toLowerCase() +
        ' Rating of ' + capitalize(user.name) + '\n').join('') : 'Loading';
    return msg.reply.text(
        'Welcome!\n' +
        '<b><i>/rating</i></b> - Overall rating\n' +
        '<b><i>/refresh</i></b>  - Manual refresh of database.\n' +
        '<b><i>/add username1 username2</i></b>  ... - adding users\n\n' +
        ratingText, { parseMode: 'HTML' }
    )
});

bot.on(['/add'], async (msg) => {
    const userNameList = msg.text.split(' ');
    if (userNameList.length === 1) return msg.reply.text('Please, enter at least 1 username after /add command');
    let userNameListText = "";
    for(let i = 1; i < userNameList.length; i++){
        await Database.addUser(userNameList[i]).then(() => {
            userNameListText += userNameList[i] + "\n";
            bot.on(['/' + userNameList[i].toLowerCase()], (msg) => callbackForUser(msg, userNameList[i]));
        });
    }
    refreshUsers();
    return msg.reply.text('Users that were added:\n' + userNameListText);
});

bot.on(['/refresh'], (msg) => {
    refreshUsers();
    msg.reply.text('Database will be refreshed');
});

bot.on(['/rating'], async msg => {
    const rating = users.map((user, index) => (index + 1) + ". " + user.username + ":\t" + user.solved + "\n").join('');
    return msg.reply.text(rating);
});

bot.start();