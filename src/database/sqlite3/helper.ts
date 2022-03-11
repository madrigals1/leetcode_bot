/* eslint-disable camelcase */
import {
  Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes,
} from 'sequelize';

import { constants } from '../../utils/constants';

export const sequelize = new Sequelize('sqlite::memory:', {
  storage: `database/sqlite3/${constants.DATABASE.SQLITE3.FILENAME}`,
  logging: false,
});

export class User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: number;

  declare username: string;
}

export class Channel
  extends Model<InferAttributes<Channel>, InferCreationAttributes<Channel>> {
  declare id: number;

  declare chat_id: string;

  declare provider: number;

  declare user_limit: number;
}

export class ChannelUser
  extends Model<
    InferAttributes<ChannelUser>,
    InferCreationAttributes<ChannelUser>
  > {
  declare id: number;

  declare channel_id: number;

  declare username: string;
}

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
