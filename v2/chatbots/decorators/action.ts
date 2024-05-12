import { REGISTERED_ACTIONS } from '../actions';
import { ActionContext, Context } from '../models';

import { ReplyHandler } from './replyHandler';

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

      // Run action to get message
      const message = await originalMethod(
        context,
        context.provider,
      );

      // Reply message with Grafana logging
      return replyHandler.reply(message, context);
    };

    // Register action
    REGISTERED_ACTIONS.push({
      name: actionName,
      args: requestedArgs,
      property: propertyKey,
    });

    return descriptor;
  };
}
