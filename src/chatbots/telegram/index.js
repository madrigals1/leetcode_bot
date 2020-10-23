process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');

const User = require('../../cache/user');
const { log } = require('../../utils/helper');
const { actions } = require('../actions');
const { STATUS, TELEGRAM } = require('../../utils/constants');
const { BOT_MESSAGES } = require('../../utils/dictionary');

const {
  getArgs, createRatingListReplyMarkup, sendMessage,
} = require('./utils');

class Telegram {
  constructor() {
    // Save token and options
    this.token = TELEGRAM.TOKEN;
    this.options = { polling: true };
    this.ratingActionName = 'rating';
    this.ignoredActions = [this.ratingActionName];
  }

  run() {
    // Start the bot
    this.bot = new TelegramBot(this.token, this.options);

    // Log that Telegram BOT is connected
    log('>>> Telegram BOT is connected!');

    // Add regular actions
    actions.forEach((action) => {
      // Skip /rating action
      if (this.ignoredActions.includes(action.name)) return;

      // convert regular string to regexp
      const actionNameRegex = new RegExp(action.name);

      this.bot.onText(actionNameRegex, (message) => {
        // If action is send from User, send typing indicator
        if (message.chat) {
          this.bot.sendChatAction(message.chat.id, STATUS.TYPING).then();
        }

        // Get args from message
        const args = getArgs(message.text);

        // Create context for action
        const context = {
          chatId: message.chat.id,
          prefix: TELEGRAM.PREFIX,
          options: { parse_mode: 'HTML' },
          bot: this.bot,
        };

        action.execute(args, sendMessage, context);
      });
    });

    // Set specific rating command
    this.bot.onText(
      new RegExp(this.ratingActionName), (msg) => this.ratingAction(msg),
    );

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
        return this.ratingAction(message, data);
      }

      return null;
    });

    log('>>> Telegram BOT is running!');
  }

  async ratingAction(message, data = null) {
    // Get text from message or data if provided
    const text = data || message.text;

    // Get args from text
    const args = getArgs(text);

    // Create context for responding
    const context = {
      chatId: message.chat.id,
      options: { parse_mode: 'HTML' },
      bot: this.bot,
    };

    // If more than 1 User was sent
    if (args.length > 1) sendMessage(BOT_MESSAGES.INCORRECT_INPUT, context);

    // Load users from repo
    const users = User.all();

    // Context for message with reply markup
    const replyMarkupContext = {
      chatId: context.chatId,
      options: {
        parse_mode: 'HTML',
        reply_markup: createRatingListReplyMarkup(users),
      },
      bot: this.bot,
    };

    // If 1 User was sent
    if (args.length === 1) {
      const username = args[0].toLowerCase();
      const user = User.load(username);

      // If user does exist, return user data with reply markup
      if (user) {
        return sendMessage(BOT_MESSAGES.USER_TEXT(user), replyMarkupContext);
      }

      return sendMessage(BOT_MESSAGES.USERNAME_NOT_FOUND(username));
    }

    // If 0 User was sent
    return sendMessage(
      BOT_MESSAGES.RATING_TEXT(User.all()), replyMarkupContext,
    );
  }
}

module.exports = new Telegram();
