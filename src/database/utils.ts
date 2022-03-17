import { FindOptions, Sequelize } from 'sequelize';

export function usernameFindOptions(username: string): FindOptions {
  return {
    where: Sequelize.where(
      Sequelize.fn('lower', Sequelize.col('username')),
      username.toLowerCase(),
    ),
  };
}
