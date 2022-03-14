/* eslint-disable camelcase */
import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';

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
