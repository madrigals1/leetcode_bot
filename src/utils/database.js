const mongoose = require('mongoose');
const { getLeetcodeDataFromUsername } = require('../scraper/functions');
const UserModel = require('../models/user');
const system = require('../models/system');
const { DB_NAME, DB_PORT, MONGO_URL } = require('./constants');

const server = `${MONGO_URL}:${DB_PORT}`;

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
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

  async loadUser(username) {
    return UserModel.findOne({ username: username });
  }

  async findUsers() {
    return await UserModel.find().sort({ solved: -1 });
  }

  async refreshUsers() {
    let users = [];
    if (system.users.length === 0) {
      users = await this.findUsers();
      for (let user of users) {
        system.users.push(await getLeetcodeDataFromUsername(user.username));
      }
    } else {
      let sc = [];
      for (let user of system.users) {
        sc.push(await getLeetcodeDataFromUsername(user.username));
      }
      system.users = sc;
    }
  }
}


module.exports = new Database();
