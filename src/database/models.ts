/* eslint-disable camelcase */
import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';

export class DatabaseUser
  extends Model<
    InferAttributes<DatabaseUser>,
    InferCreationAttributes<DatabaseUser>
  > {
  declare id: number;

  declare username: string;

  declare data: string;
}

export class DatabaseChannel
  extends Model<
    InferAttributes<DatabaseChannel>,
    InferCreationAttributes<DatabaseChannel>
  > {
  declare id: number;

  declare chat_id: string;

  declare provider: number;

  declare user_limit: number;
}

export class DatabaseChannelUser
  extends Model<
    InferAttributes<DatabaseChannelUser>,
    InferCreationAttributes<DatabaseChannelUser>
  > {
  declare id: number;

  declare channel_id: number;

  declare username: string;
}

export class DatabaseSubscription
  extends Model<
    InferAttributes<DatabaseSubscription>,
    InferCreationAttributes<DatabaseSubscription>
  > {
  declare id: number;

  declare chat_id: string;

  declare provider: number;

  declare subscription_type: number;
}
