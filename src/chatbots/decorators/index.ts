import { Context } from '../models';
import { registeredActions } from '../actions';
import ArgumentManager from '../argumentManager';
import { ArgumentsError, InputError } from '../../global/errors';
import { ErrorMessages } from '../../global/messages';

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
      isAdmin: isAdminAction,
    } = actionContext;

    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = async (context: Context) => {
      // Create action handler
      const replyHandler = new ReplyHandler(actionName, context);

      // Add Channel to Context
      context.channelCache = await getOrCreateChannel(context.channelKey);

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
          return replyHandler.handleError(ErrorMessages.server());
        }

        // If error is not known, throw it
        throw e;
      }

      // Add args to the context
      const updatedContext = { ...context, args: argumentManager };

      // Check admin rights if action is Admin Action
      if (isAdminAction) {
        const isMessageFromAdmin = await context.isAdmin;

        if (!isMessageFromAdmin) {
          return replyHandler.handleError(ErrorMessages.youNeedAdminRights);
        }
      }

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
