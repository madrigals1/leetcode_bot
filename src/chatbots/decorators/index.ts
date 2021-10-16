import dictionary from '../../utils/dictionary';
import { Context } from '../models';
import { registeredActions } from '../actions';
import constants from '../../utils/constants';
import ArgumentManager from '../argumentManager';

import { ActionContext } from './models';
import { getArgs, getParsedArguments } from './utils';

function getPassword(argumentManager: ArgumentManager): string {
  const passwordArguments = ['password', 'username_or_password'];

  for (let i = 0; i < passwordArguments.length; i++) {
    const passwordArgument = passwordArguments[i];

    const parsedArgument = argumentManager.get(passwordArgument);

    if (parsedArgument && parsedArgument.value !== '') {
      return parsedArgument.value;
    }
  }

  const reason = 'Password not found in arguments';
  const errMsg = dictionary.SERVER_MESSAGES.ARGUMENT_EXCEPTION_PREFIX + reason;

  throw new Error(errMsg);
}

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
    const { name, args, isAdmin } = actionContext;

    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = async (context: Context) => {
      const { reply, text } = context;

      // Get args list from message text
      const messageArgs = getArgs(text);

      let argumentManager: ArgumentManager;

      try {
        argumentManager = getParsedArguments(messageArgs, args);
      } catch (e: unknown) {
        return reply(dictionary.BOT_MESSAGES.INCORRECT_INPUT, context);
      }

      // Add args to the context
      const updatedContext = { ...context, args: argumentManager };

      // Check password if action is Admin Action
      if (isAdmin) {
        // Password should be last argument of message
        let password: string;

        try {
          password = getPassword(argumentManager);
        } catch {
          return reply(dictionary.BOT_MESSAGES.INCORRECT_INPUT, updatedContext);
        }

        if (password !== constants.SYSTEM.MASTER_PASSWORD) {
          return reply(
            dictionary.BOT_MESSAGES.PASSWORD_IS_INCORRECT, updatedContext,
          );
        }

        // Add password to context
        updatedContext.password = password;
      }

      const message = await originalMethod(updatedContext);
      return reply(message, updatedContext);
    };

    // Register action
    registeredActions.push({ name, property: propertyKey });

    return descriptor;
  };
}
