import mongoose from 'mongoose';
import {mongoURL} from './config';
import {getLeetcodeDataFromUsername} from "../scraper/functions";
import UserModel from '../models/user';
import system from '../models/system';
import {database as db, port} from "./constants"

const server = `${mongoURL}:${port}`;
const database = db;

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(`mongodb://${server}/${database}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
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
        return user.save()
            .then(user => user)
            .catch(err => {
                console.error(err);
            })
    }

    async loadUser(username) {
        return await UserModel.findOne({ username: username });
    }

    async findUsers() {
        return await UserModel.find().sort({'solved': -1});
    }

    async refreshUsers() {
        let users = [];
        if (system.users.length === 0) {
            users = await this.findUsers();
            for(let user of users){
                system.users.push(await getLeetcodeDataFromUsername(user.username));
            }
        } else {
            let sc = [];
            for(let user of system.users){
                sc.push(await getLeetcodeDataFromUsername(user.username));
            }
            system.users = sc;
        }
    };
}

export default new Database();
