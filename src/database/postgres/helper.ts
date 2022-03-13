import { Sequelize, DataTypes } from 'sequelize';

import { constants } from '../../utils/constants';
import { User, ChannelUser, Channel } from '../models';

const { POSTGRES } = constants.DATABASE;
const {
  USER, PASSWORD, URL, PORT, NAME,
} = POSTGRES;

const connectionUri = `postgres://${USER}:${PASSWORD}@${URL}:${PORT}/${NAME}`;

export const sequelize = new Sequelize(connectionUri, { logging: false });

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { sequelize, modelName: 'users' });

Channel.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  chat_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  provider: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  user_limit: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
}, { sequelize, modelName: 'channels' });

ChannelUser.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  channel_id: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { sequelize, modelName: 'channel_users' });
