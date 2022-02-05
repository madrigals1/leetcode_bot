export default {
  CREATE_USERS_TABLE: (
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL
    );`
  ),
  CREATE_CHANNELS_TABLE: (
    `CREATE TABLE IF NOT EXISTS channels (
      id INTEGER PRIMARY KEY,
      chat_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      user_limit INTEGER NOT NULL
    );`
  ),
  CREATE_CHANNEL_USERS_TABLE: (
    `CREATE TABLE IF NOT EXISTS channel_users (
      id INTEGER PRIMARY KEY,
      channel_id INTEGER,
      username TEXT NOT NULL,
      FOREIGN KEY(channel_id) REFERENCES channels(id)
    );`
  ),
  FIND_ALL_USERS: 'SELECT username FROM users;',
  LOAD_USER: 'SELECT username FROM users WHERE username=?;',
  ADD_USER: 'INSERT INTO users(username) VALUES (?);',
  REMOVE_USER: 'DELETE FROM users WHERE username=?;',
  REMOVE_ALL_USERS: 'DELETE FROM users',
};
