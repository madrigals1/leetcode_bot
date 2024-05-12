import { RequestedArgument } from '../argument/models';

export interface RegisteredAction {
  name: string;
  args: RequestedArgument[];
  property: string;
}
