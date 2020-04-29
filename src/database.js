const mongoose = require('mongoose');
const {getLeetcodeDataFromUsername} = require("./scraper/functions");

const server = 'localhost:27017';
const database = 'leetbot_db';
const UserModel = require('./models/user');

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(`mongodb://${server}/${database}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() => {
                console.log('Database connection successful');
            })
            .catch(err => {
                console.error('Database connection error', err);
            });
    }

    async addUser(username) {
        const userData = await getLeetcodeDataFromUsername(username);
        if (!userData) return;
        const user = new UserModel(userData);
        user.save()
            .then(doc => {
                console.log(doc);
            })
            .catch(err => {
                console.error(err);
            })
    }

    async loadUser(username) {
        return await UserModel.findOne({ username: username })
            .then(doc => {
                return doc;
            })
            .catch(err => {
                console.error(err);
                return null;
            });
    }

    async findUsers() {
        return await UserModel.find().sort({"solved": -1})
            .then(doc => {
                return doc;
            })
            .catch(err => {
                console.error(err);
                return null;
            });
    }

    async refreshUsers() {
        let users = await this.findUsers();

        if (!users) {
            return {};
        }

        for (let user of users) {
            const userData = await getLeetcodeDataFromUsername(user.username);
            UserModel.findOneAndUpdate({ _id: user._id }, userData);
        }

        return await this.findUsers();
    };
}

module.exports = new Database();