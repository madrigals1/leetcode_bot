import users from './data.mock';

function getLeetcodeDataFromUsername(username) {
  return new Promise((resolve) => {
    const foundUser = users.find((user) => user.username === username);
    resolve(foundUser);
  });
}

export default getLeetcodeDataFromUsername;
