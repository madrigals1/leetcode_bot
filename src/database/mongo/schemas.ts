/* eslint-disable camelcase */
import * as mongoose from 'mongoose';

export interface IUserModel extends mongoose.Document {
  username: string;
}

export interface IChannelModel extends mongoose.Document {
  chat_id: string;
  provider: number;
  user_limit: number;
}

// MongoDB collection schemas
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

const channelSchema = new mongoose.Schema({
  chat_id: {
    type: String,
    required: true,
    unique: true,
  },
  provider: {
    type: Number,
    required: true,
  },
  user_limit: {
    type: Number,
    required: true,
  },
});

// MongoDB models
const UserModel = mongoose.model<IUserModel>('User', userSchema);
const ChannelModel = mongoose.model<IChannelModel>('Channel', channelSchema);

export { UserModel, ChannelModel };
