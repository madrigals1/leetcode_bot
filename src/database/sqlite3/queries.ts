export default {
  // Table Creation
  CREATE_USERS_TABLE: `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL
    );
  `,
  CREATE_CHANNELS_TABLE: `
    CREATE TABLE IF NOT EXISTS channels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chat_id TEXT NOT NULL,
      provider INTEGER NOT NULL,
      user_limit INTEGER NOT NULL
    );
  `,
  CREATE_CHANNEL_USERS_TABLE: `
    CREATE TABLE IF NOT EXISTS channel_users (
      channel_id INTEGER,
      username TEXT NOT NULL,
      FOREIGN KEY(channel_id) REFERENCES channels(id)
    );
  `,

  // Users
  FIND_ALL_USERS: 'SELECT username FROM users;',
  LOAD_USER: 'SELECT username FROM users WHERE username = ?;',
  ADD_USER: 'INSERT INTO users(username) VALUES (?);',
  REMOVE_USER: 'DELETE FROM users WHERE username = ?;',
  REMOVE_ALL_USERS: 'DELETE FROM users',

  // Channels
  CREATE_CHANNEL: `
    INSERT INTO channels (chat_id, provider, user_limit)
    VALUES (?, ?, ?);
  `,
  GET_ALL_CHANNELS: 'SELECT * FROM channels;',
  GET_CHANNEL: 'SELECT * FROM channels WHERE chat_id = ? AND provider = ?;',
  GET_USERS_FOR_CHANNEL: `
    SELECT username
    FROM channel_users
    WHERE channel_id = (
      SELECT id
      FROM channels
      WHERE chat_id = ? AND provider = ?
    );
  `,
  DELETE_CHANNEL: 'DELETE FROM channels WHERE chat_id = ? AND provider = ?;',
  DELETE_ALL_CHANNELS: 'DELETE FROM channels',
  ADD_USER_TO_CHANNEL: `
    INSERT INTO channel_users (username, channel_id)
    VALUES (?, (SELECT id FROM channels WHERE chat_id = ? AND provider = ?));
  `,
  REMOVE_USER_FROM_CHANNEL: `
    DELETE INTO channel_users
    WHERE username = ? AND channel_id = (
      SELECT id FROM channels WHERE chat_id = ? AND provider = ?
    );
  `,
  CLEAR_CHANNEL: `
    DELETE INTO channel_users channel_id = (
      SELECT id FROM channels WHERE chat_id = ? AND provider = ?
    );
  `,
};
