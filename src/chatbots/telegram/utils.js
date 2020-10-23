const { EMOJI } = require('../../utils/constants');

const sendMessage = (message, context) => {
  const { chatId, options, bot } = context;
  return bot.sendMessage(chatId, message, options);
};

const getArgs = (message) => {
  // Get all args from message
  const args = message.split(' ');

  // Remove action name
  args.shift();

  return args;
};

const createRatingListReplyMarkup = (users) => {
  // Create menu for users
  const usersInlineKeyboard = [];

  for (let i = 0; i < Math.ceil(users.length / 3); i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      const index = (i * 3) + j;
      if (index < users.length) {
        const user = users[index];
        row.push({
          text: `${user.username}`,
          callback_data: `/rating ${user.username}`,
        });
      }
    }
    usersInlineKeyboard.push(row);
  }

  // Button for closing Keyboard Menu
  usersInlineKeyboard.push([{
    text: `${EMOJI.CROSS_MARK} Close`,
    callback_data: 'placeholder',
  }]);

  return JSON.stringify({
    inline_keyboard: usersInlineKeyboard,
  });
};

module.exports = { getArgs, createRatingListReplyMarkup, sendMessage };
