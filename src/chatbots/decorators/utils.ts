import * as _ from 'lodash';

import ArgumentManager from '../argumentManager';
import { Context } from '../models';
import { ArgumentsError, InputError } from '../../utils/errors';
import { BOT_MESSAGES as BM } from '../../utils/dictionary';
import Cache from '../../cache';
import { ChannelKey } from '../../cache/models';
import { ChannelCache } from '../../cache/channel';

import { Argument, ParsedArgument } from './models';

export function getArgs(message: string): string[] {
  // Get all args from message
  const args = message.trim().split(' ');

  // Remove action name
  args.shift();

  return args;
}

function confirmNoDuplicates(sortedArgs: Argument[]): void {
  // Find all duplicate keys
  const dupKeys = new Set<string>();
  for (let i = 1; i < sortedArgs.length; i++) {
    if (sortedArgs[i - 1].key === sortedArgs[i].key) {
      dupKeys.add(sortedArgs[i].key);
    }
  }

  if (!_.isEmpty(dupKeys)) {
    const reason = BM.DUPLICATE_KEYS_IN_ARGS(Array.from(dupKeys));
    throw new ArgumentsError(reason);
  }

  // Find all duplicate indexes
  const dupIndexes = new Set<number>();
  for (let i = 1; i < sortedArgs.length; i++) {
    if (sortedArgs[i - 1].index === sortedArgs[i].index) {
      dupIndexes.add(sortedArgs[i].index);
    }
  }

  if (!_.isEmpty(dupIndexes)) {
    const reason = BM.DUPLICATE_INDEXES_IN_ARGS(Array.from(dupIndexes));
    throw new ArgumentsError(reason);
  }
}

function confirmValidArgCount(
  maxIndexInRequestedArgs: number,
  providedArgCount: number,
): void {
  if (maxIndexInRequestedArgs > providedArgCount) {
    const reason = BM.INSUFFICIENT_ARGS_IN_MESSAGE;
    throw new InputError(reason);
  }

  if (maxIndexInRequestedArgs > 100) {
    const reason = BM.SHOULD_NOT_REQUEST_MORE_THAN_100_ARGS;
    throw new ArgumentsError(reason);
  }

  if (providedArgCount > 100) {
    const reason = BM.SHOULD_NOT_PROVIDE_MORE_THAN_100_ARGS;
    throw new InputError(reason);
  }
}

function confirmNoRequiredAfterOptional(sortedArgs: Argument[]): void {
  let optionalStarted = false;
  for (let i = 0; i < sortedArgs.length; i++) {
    const argument = sortedArgs[i];

    if (!argument.isRequired) {
      optionalStarted = true;
    } else {
      // If already started consuming optional arguments
      if (optionalStarted) {
        const reason = BM.SHOULD_NOT_HAVE_REQUIRED_ARGS_AFTER_OPTIONAL;
        throw new ArgumentsError(reason);
      }
    }
  }
}

export function getPositionalParsedArguments(
  providerContext: Context,
  requestedArgs: Argument[] = [],
): ArgumentManager {
  // Get provided args from Context
  const { text } = providerContext;

  // Get args list from message text
  const providedArgs = getArgs(text);

  // Validated Arguments after processing
  const argumentManager: ArgumentManager = new ArgumentManager();

  // Arguments that will be left out after processing provided arguments
  let unprocessedArgs = _.clone(requestedArgs ?? []);

  if (_.isEmpty(requestedArgs)) {
    // If no args are requested, no args should be provided
    if (!_.isEmpty(providedArgs)) {
      const reason = BM.MESSAGE_SHOULD_HAVE_NO_ARGS;
      throw new InputError(reason);
    }

    return argumentManager;
  }

  // Sort arguments by index
  const sortedArgs = requestedArgs.sort((a, b) => a.index - b.index);

  confirmNoDuplicates(sortedArgs);
  confirmNoRequiredAfterOptional(sortedArgs);

  // Confirm argument count and limits
  const providedArgCount = providedArgs.length;
  const requiredArguments = sortedArgs.filter((arg) => arg.isRequired);
  const lastRequiredArgument = requiredArguments[requiredArguments.length - 1];
  const maxIndexInRequestedArgs = lastRequiredArgument
    ? lastRequiredArgument.index + 1
    : 0;
  confirmValidArgCount(maxIndexInRequestedArgs, providedArgCount);

  // Variable that holds data for MultiArgument
  const curMultiArg = {
    holder: [],
    key: 'default',
    name: 'Default',
    index: -1,
  };

  let lastProseccedArgument: Argument = null;

  for (let i = 0; i < providedArgCount; i++) {
    // Find argument in requested arguments
    const foundArgument = requestedArgs
      .find((argument) => argument.index === i);

    // If current index doesn't exist in arguments
    if (!foundArgument) {
      if (_.isEmpty(curMultiArg.holder)) {
        const reason = BM.INDEX_SHOULD_BE_PRESENT_IN_ARGS(i);
        throw new ArgumentsError(reason);
      }

      // If multi arg is collecting, fill it with current provided argument
      curMultiArg.holder.push(providedArgs[i]);
      continue;
    }

    // If key exists, finish collecting multi argument
    if (!_.isEmpty(curMultiArg.holder)) {
      const argument: ParsedArgument = new ParsedArgument(
        curMultiArg.index,
        curMultiArg.key,
        curMultiArg.name,
        curMultiArg.holder,
      );

      // Add to argumentManager both by Key and Index
      argumentManager.upsert(argument);

      curMultiArg.holder = [];
      curMultiArg.key = 'default';
      curMultiArg.name = 'Default';
      curMultiArg.index = -1;
    }

    // Make argument processed by removing from unprocessed
    unprocessedArgs = unprocessedArgs.filter((arg) => arg.index !== i);

    // If argument is multiple, start collecting it
    if (foundArgument.isMultiple) {
      curMultiArg.holder = [providedArgs[i]];
      curMultiArg.key = foundArgument.key;
      curMultiArg.name = foundArgument.name;
      curMultiArg.index = foundArgument.index;

      // Set this argument as last processed
      lastProseccedArgument = foundArgument;

      // Go to next argument from message
      continue;
    } else {
      const argument: ParsedArgument = new ParsedArgument(
        foundArgument.index,
        foundArgument.key,
        foundArgument.name,
        providedArgs[i],
      );

      argumentManager.upsert(argument);
    }

    // Save last processed argument
    lastProseccedArgument = foundArgument;
  }

  // Add latest multi argument
  if (!_.isEmpty(curMultiArg.holder)) {
    const argument: ParsedArgument = new ParsedArgument(
      curMultiArg.index,
      curMultiArg.key,
      curMultiArg.name,
      curMultiArg.holder,
    );

    // Add to argumentManager both by Key and Index
    argumentManager.upsert(argument);
  }

  // Sort argument by index
  const sortedUnprocessedArgs = unprocessedArgs
    .sort((a, b) => a.index - b.index);

  // Make sure that no index is left out
  for (let i = 0; i < sortedUnprocessedArgs.length; i++) {
    const argument: Argument = sortedUnprocessedArgs[i];
    const nextIndex = lastProseccedArgument
      ? lastProseccedArgument.index + 1
      : 0;

    if (nextIndex !== argument.index) {
      if (!lastProseccedArgument.isMultiple) {
        const notFoundIndex = lastProseccedArgument.index + 1;
        const reason = BM.ARG_IS_NOT_PROVIDED(notFoundIndex);
        throw new ArgumentsError(reason);
      }
    }

    // Add empty value optional argument
    argumentManager.upsert(new ParsedArgument(
      argument.index,
      argument.key,
      argument.name,
      argument.isMultiple ? [] : '',
    ));

    // Save last processed argument
    lastProseccedArgument = argument;
  }

  return argumentManager;
}

export async function getOrCreateChannel(
  channelKey: ChannelKey,
): Promise<ChannelCache> {
  const existingChannelCache = Cache.getChannel(channelKey);

  if (existingChannelCache) return existingChannelCache;

  const newChannelCache = await Cache.registerChannel(channelKey);

  return newChannelCache;
}
