import { FindOptions, UpdateOptions, Sequelize } from 'sequelize';

export function usernameFindOptions(username: string): FindOptions {
  return {
    where: Sequelize.where(
      Sequelize.fn('lower', Sequelize.col('username')),
      username.toLowerCase(),
    ),
  };
}

export function usernameUpdateOptions(username: string): UpdateOptions {
  return {
    where: Sequelize.where(
      Sequelize.fn('lower', Sequelize.col('username')),
      username.toLowerCase(),
    ),
  };
}
