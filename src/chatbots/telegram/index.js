process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');

const User = require('../../cache/user');
const { log } = require('../../utils/helper');
const { actions } = require('../actions');
const { STATUS, TELEGRAM } = require('../../utils/constants');

const { getArgs, createRatingListReplyMarkup, reply } = require('./utils');

class Telegram {
  constructor() {
    // Save token and options
    this.token = TELEGRAM.TOKEN;
    this.options = { polling: true };
    this.ratingActionName = 'rating';
    this.ratingAction = actions.find(
      (action) => action.name === this.ratingActionName,
    ).execute;
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

        // Variable to check if this action is rating action for reply markup
        const willIncludeRatingReplyMarkup = (
          action.name === this.ratingActionName
        );

        // Create context for action
        const context = willIncludeRatingReplyMarkup
          ? this.replyMarkupContext(message.chat.id)
          : {
            chatId: message.chat.id,
            prefix: TELEGRAM.PREFIX,
            options: { parse_mode: 'HTML' },
            bot: this.bot,
          };

        action.execute(args, reply, context);
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

      // If message starts with /rating, call rating action
      if (data.match(this.ratingActionName)) {
        // Get args from callback_query message
        const args = getArgs(data);

        return this.ratingAction(
          args,
          reply,
          this.replyMarkupContext(message.chat.id),
        );
      }

      return null;
    });

    log('>>> Telegram BOT is running!');
  }

  replyMarkupContext(chatId) {
    return {
      chatId,
      prefix: TELEGRAM.PREFIX,
      options: {
        parse_mode: 'HTML',
        reply_markup: createRatingListReplyMarkup(User.all()),
      },
      bot: this.bot,
    };
  }
}

module.exports = new Telegram();
