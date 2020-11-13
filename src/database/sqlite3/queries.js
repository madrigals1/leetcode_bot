module.exports = {
  CREATE_USERS_TABLE: (
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL
    );`
  ),
  FIND_ALL_USERS: 'SELECT username FROM users;',
  LOAD_USER: 'SELECT username FROM users WHERE username=?;',
  ADD_USER: 'INSERT INTO users(username) VALUES (?);',
  REMOVE_USER: 'DELETE FROM users WHERE username=?;',
  REMOVE_ALL_USERS: 'DELETE FROM users',
};
