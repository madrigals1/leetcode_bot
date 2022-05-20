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

export interface ISubscriptionModel extends mongoose.Document {
  chat_id: string;
  provider: number;
  subscription_type: number;
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

const subscriptionSchema = new mongoose.Schema({
  chat_id: {
    type: String,
    required: true,
  },
  provider: {
    type: Number,
    required: true,
  },
  subscription_type: {
    type: Number,
    required: true,
  },
});

// MongoDB models
const UserModel = mongoose.model<IUserModel>('User', userSchema);
const ChannelModel = mongoose.model<IChannelModel>('Channel', channelSchema);
const SubscriptionModel = mongoose
  .model<ISubscriptionModel>('Channel', subscriptionSchema);

export { UserModel, ChannelModel, SubscriptionModel };
