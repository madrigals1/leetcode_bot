import { Sequelize, DataTypes } from 'sequelize';

import { constants } from '../../utils/constants';
import { User, Channel, ChannelUser } from '../models';

export const sequelize = new Sequelize('sqlite::memory:', {
  storage: `database/sqlite3/${constants.DATABASE.SQLITE3.FILENAME}`,
  logging: false,
});

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
