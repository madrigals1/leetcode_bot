import { Context } from '../models';
import { registeredActions } from '../actions';
import ArgumentManager from '../argumentManager';
<<<<<<< HEAD
import { ArgumentsError, InputError } from '../../utils/errors';
import { ErrorMessages, UserMessages } from '../../globals/messages';
=======
import { ArgumentsError, InputError } from '../../global/errors';
import { ErrorMessages } from '../../global/messages';
>>>>>>> master

import { ReplyHandler } from './replyHandler';
import { ActionContext } from './models';
import { getOrCreateChannel } from './utils';

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
    const {
      name: actionName,
      args: requestedArgs,
    } = actionContext;

    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = async (context: Context) => {
      // Create action handler
      const replyHandler = new ReplyHandler(actionName, context);

      // Add Channel to Context
      context.channelId = await getOrCreateChannel({
        chat_id: context.channelKey.chat_id,
        provider: context.channelKey.provider,
        user_limit: 1000,
      });

      // Create mutable argumentManager, so that we can apply try-catch on it
      let argumentManager: ArgumentManager;

      try {
        // Parse arguments
        argumentManager = context.argumentParser(context, requestedArgs);
      } catch (e) {
        // If error is caused by incorrect input, return error cause to User
        if (e instanceof InputError) {
          return replyHandler.handleError(e.message);
        }

        // If error is caused by codebase issues, throw generic Error
        if (e instanceof ArgumentsError) {
<<<<<<< HEAD
          return replyHandler.handleError(ErrorMessages.server);
=======
          return replyHandler.handleError(ErrorMessages.errorOnTheServer());
>>>>>>> master
        }

        // If error is not known, throw it
        throw e;
      }

      // Add args to the context
      const updatedContext = { ...context, args: argumentManager };

<<<<<<< HEAD
      // Check admin rights if action is Admin Action
      if (isAdminAction) {
        const isMessageFromAdmin = await context.isAdmin;

        if (!isMessageFromAdmin) {
          return replyHandler.handleError(UserMessages.noAdminRights);
        }
      }

=======
>>>>>>> master
      // Run action to get message
      const message = await originalMethod(
        updatedContext,
        context.channelCache,
        context.provider,
      );

      // Reply message with Grafana logging
      return replyHandler.reply(message, updatedContext);
    };

    // Register action
    registeredActions.push({
      name: actionName,
      args: requestedArgs,
      property: propertyKey,
    });

    return descriptor;
  };
}

export function admin(): (
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor {
  return (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = async (context: Context) => {
      // Check admin rights if action is Admin Action
      const isMessageFromAdmin = await context.isAdmin;

      if (!isMessageFromAdmin) {
        return context.reply(ErrorMessages.youNeedAdminRights, context);
      }

      // Run original method
      return originalMethod(context);
    };

    return descriptor;
  };
}
