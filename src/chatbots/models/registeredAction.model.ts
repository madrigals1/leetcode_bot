import { Argument } from '../decorators/models';

export interface RegisteredAction {
  name: string;
  args: Argument[];
  property: string;
}
