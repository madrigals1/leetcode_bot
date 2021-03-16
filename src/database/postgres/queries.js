const QUERIES = {
  CREATE_USERS_TABLE: 'CREATE TABLE IF NOT EXISTS users (username varchar);',
  GET_ALL_USERS: 'SELECT username FROM users;',
  LOAD_USER: (username) => `SELECT username FROM users WHERE username='${username}';`,
  ADD_USER: (username) => `INSERT INTO users (username) VALUES ('${username}');`,
  REMOVE_USER: (username) => `DELETE FROM users WHERE username='${username}';`,
  REMOVE_ALL_USERS: 'DELETE FROM users;',
};

export default QUERIES;
