/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
import dictionary from '../../utils/dictionary';
import { Context } from '../models';

export const registeredActions = [];

export function getArgs(message: string): string[] {
  // Get all args from message
  const args = message.trim().split(' ');

  // Remove action name
  args.shift();

  return args;
}

export function action(name: string, argsCount: number[]): any {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = async function (context: Context) {
      const { reply, text } = context;

      // Get args list from message text
      const args = getArgs(text);

      // Add args to the context
      const updatedContext = { ...context, args };

      // If inccorrect args amount was sent
      if (!argsCount.includes(args.length)) {
        return reply(dictionary.BOT_MESSAGES.INCORRECT_INPUT, updatedContext);
      }

      const message = await originalMethod.apply(this, updatedContext);
      return reply(message, updatedContext);
    };

    // Register action
    registeredActions.push({ name, property: propertyKey });

    return descriptor;
  };
}
