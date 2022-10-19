import { constants } from '../constants';

const { EMOJI } = constants;

export class SubscriptionMessages {
  static subscriptionSuccess(name: string): string {
    return `${EMOJI.SUCCESS} Subscribed to ${name}`;
  }

  static subscriptionError(name: string): string {
    return `${EMOJI.ERROR} Not subscribed to ${name}`;
  }

  static unsubscriptionSuccess(name: string): string {
    return `${EMOJI.SUCCESS} Unsubscribed from ${name}`;
  }

  static unsubscriptionError(name: string): string {
    return `${EMOJI.ERROR} Not unsubscribed from ${name}`;
  }
}
