import { constants } from './constants';

const { EMOJI } = constants;

const UserAddingMessages = {
  success(username: string): string {
    const message = `${EMOJI.SUCCESS} User is successfully added`;
    return `<b>${username}</b> - ${message}`;
  },
  already_exists(username: string): string {
    const message = `${EMOJI.ERROR} User already exists in this channel`;
    return `<b>${username}</b> - ${message}`;
  },
  leetcode_not_found_username(username: string): string {
    const message = `${EMOJI.ERROR} User not found in Leetcode`;
    return `<b>${username}</b> - ${message}`;
  },
  leetcode_unknown_error(username: string): string {
    const message = `${EMOJI.ERROR} Unknown error on Leetcode side`;
    return `<b>${username}</b> - ${message}`;
  },
  unknown_error(username: string): string {
    const message = `${EMOJI.ERROR} Error on the server side`;
    return `<b>${username}</b> - ${message}`;
  },
  unknown_error_overall: `${EMOJI.ERROR} Error on the server side`,
};

const UserDeletingMessages = {
  success(username: string): string {
    const emoji = EMOJI.SUCCESS;
    const user = `User <b>${username}</b>`;
    const message = 'was successfully deleted';
    return `${emoji} ${user} ${message}`;
  },

  does_not_exist(username: string): string {
    const emoji = EMOJI.ERROR;
    const user = `User <b>${username}</b>`;
    const message = 'does not exist in this channel';
    return `${emoji} ${user} ${message}`;
  },

  will_be_deleted(username: string): string {
    const emoji = EMOJI.WAITING;
    const user = `User <b>${username}</b>`;
    const message = 'will be deleted';
    return `${emoji} ${user} ${message}`;
  },

  user_list_remove: `${EMOJI.WASTEBASKET} Remove User`,
};

export {
  UserAddingMessages,
  UserDeletingMessages,
};
