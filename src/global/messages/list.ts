import { constants } from '../../utils/constants';

const { EMOJI } = constants;

export class ListMessages {
  static userListProfiles = `${EMOJI.PERSON} Profiles`;

  static userListSubmissions = `${EMOJI.CLIPBOARD} Submissions`;

  static userListProblems = `${EMOJI.CHART} Problems`;

  static userListAvatars = `${EMOJI.CAMERA} Avatars`;

  static userListLangstats = `${EMOJI.PROGRAMMER} Language stats`;

  static userListRemove = `${EMOJI.WASTEBASKET} Remove User`;

  static backToProfiles = `${EMOJI.BACK_ARROW} Back to Profiles`;

  static userListSubscription = `${EMOJI.BELL} Subscribe`;

  static userListUnsubscription = `${EMOJI.BELL} Unsubscribe`;
}
