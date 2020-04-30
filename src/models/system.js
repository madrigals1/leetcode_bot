import {capitalize} from '../utils/helper';
import {welcome_message} from '../utils/constants';

const system = {
    users: [],
    addedListeners: [],
    get welcomeText() {
        return (`
${welcome_message}

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
