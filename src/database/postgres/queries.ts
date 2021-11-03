import { Subscription } from '../../leetcode/models';

const QUERIES = {
  CREATE_USERS_TABLE: 'CREATE TABLE IF NOT EXISTS users (username varchar);',
  GET_ALL_USERS: 'SELECT username FROM users;',
  LOAD_USER: (username: string): string => `SELECT username FROM users WHERE username='${username}';`,
  ADD_USER: (username: string): string => `INSERT INTO users (username) VALUES ('${username}');`,
  REMOVE_USER: (username: string): string => `DELETE FROM users WHERE username='${username}';`,
  REMOVE_ALL_USERS: 'DELETE FROM users;',
  CREATE_SUBSCRIPTIONS_TABLE: 'CREATE TABLE IF NOT EXISTS subscriptions '
    + '(chatId varchar PRIMARY KEY, provider varchar);',
  GET_ALL_SUBSCRIPTIONS: 'SELECT chatId, provider FROM subscriptions;',
  LOAD_SUBSCRIPTION: (
    chatId: string,
  ): string => `SELECT chatId, provider FROM subscriptions WHERE chatId='${chatId}';`,
  ADD_SUBSCRIPTION: (
    subscription: Subscription,
  ): string => `INSERT INTO subscriptions (chatId, provider) VALUES ('${subscription.chatId}', '${subscription.provider}');`,
  UPDATE_SUBSCRIPTION: (
    subscription: Subscription,
  ): string => `UPDATE subscriptions SET provider='${subscription.provider}' WHERE chatId=${subscription.chatId};`,
  REMOVE_SUBSCRIPTION: (
    chatId: string,
  ): string => `DELETE FROM subscriptions WHERE chatId='${chatId}';`,
};

export default QUERIES;
