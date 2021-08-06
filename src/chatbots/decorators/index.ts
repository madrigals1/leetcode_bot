/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
import dictionary from '../../utils/dictionary';
import { Context } from '../models';
import { registeredActions } from '../actions';

import { ActionContext } from './models';
import { getArgs, isValidArgsCount } from './utils';

// eslint-disable-next-line import/prefer-default-export
export function action(actionContext: ActionContext): any {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const { name, argsCount } = actionContext;

    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = async function (context: Context) {
      const { reply, text } = context;

      // Get args list from message text
      const args = getArgs(text);

      // Add args to the context
      const updatedContext = { ...context, args };

      // If inccorrect args amount was sent
      if (!isValidArgsCount(args, argsCount)) {
        return reply(dictionary.BOT_MESSAGES.INCORRECT_INPUT, updatedContext);
      }

      const message = await originalMethod(updatedContext, args, reply);
      return reply(message, updatedContext);
    };

    // Register action
    registeredActions.push({ name, property: propertyKey });

    return descriptor;
  };
}
