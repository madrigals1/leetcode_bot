import {capitalize} from '../utils/helper';

const system = {
    users: [],
    addedListeners: [],
    get welcomeText() {
        return (`
Welcome! This is Leetcode Rating bot Elite Boys.
<b><i>/rating</i></b> - Overall rating
<b><i>/refresh</i></b>  - Manual refresh of database.
<b><i>/add username1 username2</i></b>  ... - adding users 

${this.usersText}
`)},
    get ratingText() {
        return this.users.map((user, index) => `${index + 1}. *${user.username}* ${user.solved}\n`).join('');
    },
    get usersText() {
        return this.users ? this.users.map(user => `<b><i>/${user.username.toLowerCase()}</i></b> Rating of ${capitalize(user.name)} \n`)
            .join('') : 'Loading...';
    },
};

export default system;