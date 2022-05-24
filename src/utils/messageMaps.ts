import { constants } from './constants';

const { EMOJI } = constants;

const UserAddingMessages = {
  success: `${EMOJI.SUCCESS} User is successfully added`,
  already_exists: `${EMOJI.ERROR} User already exists in this channel`,
  leetcode_not_found_username: `${EMOJI.ERROR} User not found in Leetcode`,
  leetcode_unknown_error: `${EMOJI.ERROR} Unknown error on Leetcode side`,
  unknown_error: `${EMOJI.ERROR} Error on the server side`,
};

export {
  UserAddingMessages,
};
