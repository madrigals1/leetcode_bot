const { capitalize } = require('../utils/helper');
const { welcomeMessage } = require('../utils/constants');

const system = {
  users: [],
  addedListeners: [],
  lastRefresh: null,
  get welcomeText() {
    return `
${welcomeMessage}

${this.usersText}
`;
  },
  get ratingText() {
    return this.users
      .map((user, index) => `${index + 1}. *${user.username}* ${user.solved}\n`)
      .join('');
  },
  get usersText() {
    return this.users
      .map(
        (user) => `<b><i>/${user.username.toLowerCase()}</i></b> Rating of ${capitalize(user.name)} \n`,
      )
      .join('');
  },

  resort() {
    this.users.sort(
      (user1, user2) => parseInt(user2.solved, 10) - parseInt(user1.solved, 10),
    );
  },
};

module.exports = system;
