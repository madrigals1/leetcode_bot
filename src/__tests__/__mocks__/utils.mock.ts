import { User } from '../../leetcode/models';

import users from './data.mock';

function getLeetcodeDataFromUsername(username: string): Promise<User> {
  return new Promise((resolve) => {
    const foundUser = users.find((user) => user.username === username);
    resolve(foundUser || { exists: false });
  });
}

export default getLeetcodeDataFromUsername;
