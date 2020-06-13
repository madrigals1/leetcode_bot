const mongoose = require('mongoose');

const { getLeetcodeDataFromUsername } = require('../scraper');
const { users } = require('./database');
const { log } = require('../utils/helper');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  link: String,
  solved: Number,
  all: Number,
});

const UserModel = mongoose.model('User', userSchema);

const findAll = async () => UserModel.find().sort({ solved: -1 });

const load = (username) => UserModel.findOne({ username });

const createOrUpdate = async (userData) => {
  let user = await load(userData.username);

  if (!user) {
    user = new UserModel(userData);
  }

  return user;
};

const add = async (username) => {
  const tempUser = await load(username);

  if (tempUser) {
    return null;
  }

  return getLeetcodeDataFromUsername(username)
    .then(async (userData) => {
      const { submissions } = userData;
      const user = await createOrUpdate(userData);

      await user.save();

      return { ...user, submissions };
    });
};

const refresh = async () => {
  if (users.length === 0) {
    users.push(...await findAll());
  }

  for (let i = 0; i < users.length; i++) {
    log('Refreshing', users[i].username);
    // eslint-disable-next-line no-await-in-loop
    const userData = await getLeetcodeDataFromUsername(users[i].username);

    if (userData.username !== 'Error') {
      users[i] = userData;
      log('Successfully refreshed', users[i].username);
    } else {
      log('Failed refreshing', users[i].username);
    }
  }

  log('Finished refresh');
};

module.exports = {
  findAll,
  load,
  createOrUpdate,
  add,
  refresh,
};
