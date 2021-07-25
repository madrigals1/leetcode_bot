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
