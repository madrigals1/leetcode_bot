const { capitalize } = require('../utils/helper');
const { welcome_message } = require('../utils/constants');

const system = {
  users: [],
  addedListeners: [],
  lastRefresh: null,
  get welcomeText() {
    return `
${welcome_message}

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
        (user) =>
          `<b><i>/${user.username.toLowerCase()}</i></b> Rating of ${capitalize(user.name)} \n`,
      )
      .join('');
  },
};

module.exports = system;
