import { constants } from '../constants';

const { EMOJI } = constants;

export class RatingMessages {
  static cmlRating = `${EMOJI.ABACUS} Cumulative Rating`;

  static regularRating = `${EMOJI.CLIPBOARD} Regular Rating`;

  static graphRating = `${EMOJI.CHART} Graph Rating`;

  static contestRating = `${EMOJI.CUP} Contest Rating`;
}
