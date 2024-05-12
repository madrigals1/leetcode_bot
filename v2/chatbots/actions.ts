import { action } from './decorators';
import { RegisteredAction } from './models';

export const REGISTERED_ACTIONS: RegisteredAction[] = [];

export default class Actions {
  @action({ name: 'ping' })
  static ping(): string {
    return 'pong';
  }
}
