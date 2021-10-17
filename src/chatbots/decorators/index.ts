import dictionary from '../../utils/dictionary';
import { Context } from '../models';
import { registeredActions } from '../actions';
import constants from '../../utils/constants';
import ArgumentManager from '../argumentManager';
import { ArgumentsError, InputError } from '../../utils/errors';

import { ActionContext } from './models';

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
  throw new InputError(reason);
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
    const { name, args: requestedArgs, isAdmin } = actionContext;

    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = async (context: Context) => {
      const { reply, argumentParser } = context;

      // Make it mutable, so that we can apply try-catch on it
      let argumentManager: ArgumentManager;

      try {
        argumentManager = argumentParser(context, requestedArgs);
      } catch (e) {
        // If error is caused by incorrect input, return error cause to User
        if (e instanceof InputError) {
          return reply(e.message, context);
        }

        // If error is caused by codebase issues, throw it
        if (e instanceof ArgumentsError) {
          reply(dictionary.BOT_MESSAGES.ERROR_ON_THE_SERVER, context);
        }

        throw e;
      }

      // Add args to the context
      const updatedContext = { ...context, args: argumentManager };

      // Check password if action is Admin Action
      if (isAdmin) {
        // Password should be last argument of message
        let password: string;

        try {
          password = getPassword(argumentManager);
        } catch (e) {
          // If error is caused by incorrect input, return error cause to User
          if (e instanceof InputError) {
            return reply(e.message, context);
          }

          throw e;
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
    registeredActions.push({
      name, args: requestedArgs, property: propertyKey,
    });

    return descriptor;
  };
}
