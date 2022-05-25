import { constants } from '../../utils/constants';

const { EMOJI } = constants;

export class RatingMessages {
  static cmlRating = `${EMOJI.ABACUS} Cumulative Rating`;

  static regularRating = `${EMOJI.CLIPBOARD} Regular Rating`;

  static graphRating = `${EMOJI.CHART} Graph Rating`;

  static incorrectRatingType = `${EMOJI.ERROR} Incorrect rating type`;
}
