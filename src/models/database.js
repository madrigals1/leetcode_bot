const mongoose = require('mongoose');

const { getLeetcodeDataFromUsername } = require('../scraper');
const UserModel = require('./user');
const users = require('./userList');
const { DB_NAME, DB_PORT, MONGO_URL } = require('../utils/constants');

const server = `${MONGO_URL}:${DB_PORT}`;

class Database {
  constructor() {
    this.connect();
  }

  // eslint-disable-next-line class-methods-use-this
  connect() {
    mongoose
      .connect(`mongodb://${server}/${DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.error('Database connection error', err);
      });
  }

  // eslint-disable-next-line class-methods-use-this
  async loadUser(username) {
    return UserModel.findOne({ username });
  }

  async createOrUpdate(userData) {
    let user = await this.loadUser(userData.username);

    if (!user) {
      user = new UserModel(userData);
    }

    return user;
  }

  // eslint-disable-next-line class-methods-use-this
  async addUser(username) {
    return getLeetcodeDataFromUsername(username)
      .then(async (userData) => {
        const user = await this.createOrUpdate(userData);

        await user.save()
          .catch((err) => {
            console.error(err);
          });

        return user;
      });
  }

  // eslint-disable-next-line class-methods-use-this
  async findUsers() {
    return UserModel.find().sort({ solved: -1 });
  }

  async refreshUsers() {
    if (users.length === 0) {
      users.push(...await this.findUsers());
    }

    for (let i = 0; i < users.length; i++) {
      console.log('Refreshing', users[i].username);
      // eslint-disable-next-line no-await-in-loop
      users[i] = await getLeetcodeDataFromUsername(users[i].username);
    }

    console.log('Finished refresh');
  }
}


module.exports = new Database();
