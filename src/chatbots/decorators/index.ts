import dictionary from '../../utils/dictionary';
import { Context } from '../models';
import { registeredActions } from '../actions';
import constants from '../../utils/constants';

import { ActionContext } from './models';
import { getArgs, isValidArgsCount } from './utils';

// eslint-disable-next-line import/prefer-default-export
export function action(actionContext: ActionContext): (
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor {
  return (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const { name, argsCount, isAdmin } = actionContext;

    // Random comment
    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = async (context: Context) => {
      const { reply, text } = context;

      // Get args list from message text
      const args = getArgs(text);

      // Add args to the context
      const updatedContext = { ...context, args };

      // If inccorrect args amount was sent
      if (!isValidArgsCount(args, argsCount)) {
        return reply(dictionary.BOT_MESSAGES.INCORRECT_INPUT, updatedContext);
      }

      // Check password if action is Admin Action
      if (isAdmin) {
        // Password should be last argument of message
        const password = args[args.length - 1];

        if (password !== constants.MASTER_PASSWORD) {
          return reply(
            dictionary.BOT_MESSAGES.PASSWORD_IS_INCORRECT, updatedContext,
          );
        }

        // Add password to context
        updatedContext.password = password;

        // Remove password argument
        updatedContext.args.pop();
      }

      const message = await originalMethod(updatedContext, args, reply);
      return reply(message, updatedContext);
    };

    // Register action
    registeredActions.push({ name, property: propertyKey });

    return descriptor;
  };
}
