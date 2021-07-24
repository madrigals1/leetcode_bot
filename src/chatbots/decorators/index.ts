/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
import dictionary from '../../utils/dictionary';
import { Context } from '../models';
import { registeredActions } from '../actions';

export function getArgs(message: string): string[] {
  // Get all args from message
  const args = message.trim().split(' ');

  // Remove action name
  args.shift();

  return args;
}

export function isValidArgsCount(
  args: string[], argsCount: number[] | string,
): boolean {
  if (typeof argsCount === 'object') return argsCount.includes(args.length);

  if (argsCount === '+') return args.length > 1;

  if (argsCount === '?') return true;

  throw new Error(`Invalid argument argsCount: ${argsCount}`);
}

export function action(name: string, argsCount: number[] | string): any {
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
      if (!isValidArgsCount(args, argsCount)) {
        return reply(dictionary.BOT_MESSAGES.INCORRECT_INPUT, updatedContext);
      }

      const message = await originalMethod(updatedContext);
      return reply(message, updatedContext);
    };

    // Register action
    registeredActions.push({ name, property: propertyKey });

    return descriptor;
  };
}
