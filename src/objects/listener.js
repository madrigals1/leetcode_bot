const { STATUS } = require('../utils/constants');

class Listener {
  constructor(actionType, types, callback) {
    this.actionType = actionType;
    this.types = types;
    this.callback = callback;
  }

  init(bot) {
    this.types.forEach((type) => {
      bot[this.actionType](type, (msg) => {
        // If action is send from User, send typing indicator
        if (msg.chat) {
          bot.sendChatAction(msg.chat.id, STATUS.TYPING);
        }
        this.callback(msg);
      });
    });
  }
}

module.exports = Listener;
