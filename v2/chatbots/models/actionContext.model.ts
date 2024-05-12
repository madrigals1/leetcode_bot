import { RequestedArgument } from '../argument';

export interface ActionContext {
  name: string;
  args?: RequestedArgument[];
}
