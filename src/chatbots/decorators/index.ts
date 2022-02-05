import { BOT_MESSAGES as BM } from '../../utils/dictionary';
import { Context } from '../models';
import { registeredActions } from '../actions';
import { constants } from '../../utils/constants';
import ArgumentManager from '../argumentManager';
import { ArgumentsError, InputError } from '../../utils/errors';
import { actionLogger } from '../../prometheus';

import { ReplyHandler } from './replyHandler';
import { ActionContext } from './models';
import { getPassword, getOrCreateChannel } from './utils';

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
      // Create action handler and start logging action
      const replyHandler = new ReplyHandler(
        actionLogger.startTimer(), name, context,
      );

      // Get Channel Cache
      const channelCache = await getOrCreateChannel(context.channelKey);

      // Add Channel Cache and Key to Context
      context.channelCache = channelCache;

      const { argumentParser } = context;

      // Make it mutable, so that we can apply try-catch on it
      let argumentManager: ArgumentManager;

      try {
        argumentManager = argumentParser(context, requestedArgs);
      } catch (e) {
        // If error is caused by incorrect input, return error cause to User
        if (e instanceof InputError) {
          return replyHandler.handleError(e.message);
        }

        // If error is caused by codebase issues, throw it
        if (e instanceof ArgumentsError) {
          return replyHandler.handleError(BM.ERROR_ON_THE_SERVER);
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
            return replyHandler.handleError(e.message);
          }

          throw e;
        }

        if (password !== constants.SYSTEM.MASTER_PASSWORD) {
          return replyHandler.handleError(BM.PASSWORD_IS_INCORRECT);
        }

        // Add password to context
        updatedContext.password = password;
      }

      const message = await originalMethod(updatedContext);
      return replyHandler.reply(message, updatedContext);
    };

    // Register action
    registeredActions.push({
      name, args: requestedArgs, property: propertyKey,
    });

    return descriptor;
  };
}
