class MockFuncDiscord {
  constructor() {
    this.formattedMessage = null;
    this.options = {};
  }

  send(message, options = {}) {
    this.formattedMessage = message;
    this.options = options;
  }
}

export default MockFuncDiscord;
