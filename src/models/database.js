const mongoose = require('mongoose');
const { getLeetcodeDataFromUsername } = require('../scraper');
const UserModel = require('./user');
const system = require('./system');
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
  async addUser(username) {
    const userData = await getLeetcodeDataFromUsername(username);
    if (!userData) return;
    const user = new UserModel(userData);
    return user
      .save()
      .then((user) => user)
      .catch((err) => {
        console.error(err);
      });
  }

  // eslint-disable-next-line class-methods-use-this
  async loadUser(username) {
    return UserModel.findOne({ username });
  }

  async findUsers() {
    return UserModel.find().sort({ solved: -1 });
  }

  async refreshUsers() {
    let users = [];
    if (system.users.length === 0) {
      users = await this.findUsers();
      for (const user of users) {
        system.users.push(await getLeetcodeDataFromUsername(user.username));
      }
    } else {
      const sc = [];
      for (const user of system.users) {
        sc.push(await getLeetcodeDataFromUsername(user.username));
      }
      system.users = sc;
    }
  }
}


module.exports = new Database();
