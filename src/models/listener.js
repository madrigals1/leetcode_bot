class Listener {
  constructor(types = null, callback = null) {
    this.types = types;
    this.callback = callback;
  }

  init(bot) {
    bot.on(this.types, this.callback);
  }
}

module.exports = Listener;
