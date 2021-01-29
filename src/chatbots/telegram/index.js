process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');

const { log } = require('../../utils/helper');
const { actions } = require('../actions');
const { STATUS, TELEGRAM } = require('../../utils/constants');

const { getArgs, reply } = require('./utils');

class Telegram {
  constructor() {
    // Save token and options
    this.token = TELEGRAM.TOKEN;
    this.options = { polling: true };
  }

  getContext(message, args, reply) {
    return {
      args,
      reply,
      provider: TELEGRAM.NAME,
      chatId: message.chat.id,
      prefix: TELEGRAM.PREFIX,
      options: { parse_mode: 'HTML' },
      bot: this.bot,
    };
  }

  run() {
    // Start the bot
    this.bot = new TelegramBot(this.token, this.options);

    // Log that Telegram BOT is connected
    log('>>> Telegram BOT is connected!');

    // Add regular actions
    actions.forEach((action) => {
      // convert regular string to regexp
      const actionNameRegex = new RegExp(action.name);

      this.bot.onText(actionNameRegex, (message) => {
        // If action is send from User, send typing indicator
        if (message.chat) {
          this.bot.sendChatAction(message.chat.id, STATUS.TYPING).then();
        }

        // Get args from message
        const args = getArgs(message.text);

        // Create context for message
        const context = this.getContext(message, args, reply);

        action.execute(context);
      });
    });

    // Set specific callback_query and polling_error
    this.bot.on('polling_error', (err) => log(err));
    this.bot.on('callback_query', (query) => {
      const { message, data } = query;

      // Delete message after button is clicked
      this.bot.answerCallbackQuery(query.id)
        .then(() => {
          this.bot.deleteMessage(message.chat.id, message.message_id).then();
        });

      // Check if callback data is a command
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        // If message starts with /rating, call rating action
        if (data.match(action.name)) {
          // Get args from callback_query message
          const args = getArgs(data);

          // Create context for message
          const context = this.getContext(message, args, reply);

          return action.execute(context);
        }
      }

      return null;
    });

    log('>>> Telegram BOT is running!');
  }
}

module.exports = new Telegram();
