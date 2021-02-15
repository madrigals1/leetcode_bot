class MockBotTelegram {
  constructor() {
    this.nullify();
  }

  sendPhoto(chatId, photoUrl, options) {
    this.chatId = chatId;
    this.photoUrl = photoUrl;
    this.options = options;
  }

  sendMessage(chatId, message, options) {
    this.chatId = chatId;
    this.message = message;
    this.options = options;
  }

  nullify() {
    this.chatId = null;
    this.photoUrl = null;
    this.message = null;
    this.options = null;
  }
}

export default MockBotTelegram;
