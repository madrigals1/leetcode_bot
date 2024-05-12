import { action } from './decorators';

export default class Actions {
  @action({ name: 'ping' })
  static ping(): string {
    return 'pong';
  }
}
