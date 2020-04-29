require('./config');
const TeleBot = require('telebot');

const Database = require('./database');
const { getLeetcodeDataFromUsername } = require("./scraper/functions");
const { capitalize } = require("./utils/helper");

const bot = new TeleBot(process.env.TOKEN);
let users = null;

async function refreshUsers () {
    await Database.refreshUsers()
        .then(res => {
            users = res;
        })
        .catch(err => console.error(err));
    users.forEach(user => {
        bot.on(['/' + user.username.toLowerCase()], (msg) => {
            getLeetcodeDataFromUsername(user.username).then(data => {
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