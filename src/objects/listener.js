class Listener {
  constructor(actionType, types, callback) {
    this.actionType = actionType;
    this.types = types;
    this.callback = callback;
  }

  init(bot) {
    this.types.forEach((type) => {
      bot[this.actionType](type, this.callback);
    });
  }
}

module.exports = Listener;
