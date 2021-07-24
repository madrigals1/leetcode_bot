import { Context } from './models';
import { action } from './decorators';

export default class Actions {
  @action('start', [0])
  static start(context: Context): string {
    return 'start';
  }

  @action('test', [0, 1])
  static test(context: Context): string {
    return 'test';
  }

  @action('goblin', [0, 1, 2])
  static goblin(context: Context): string {
    return 'goblin';
  }
}
