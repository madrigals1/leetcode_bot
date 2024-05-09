import * as _ from 'lodash';

import { Response, Status } from '../../models';

import { Argument } from './models';

/**
 * Stored arguments in 2 maps:
 * - Arguments by keys.
 * - Arguments by indexes.
 *
 * When creating an argument, both key and index should be provided.
 *
 * Notes:
 * - Updating argument by key/index will update the argument
 * in both maps.
 * - Deleting argument by key/index will delete the argument
 * in both maps.
 */
export default class ArgumentManager {
  keyMap = new Map<string, Argument>();

  indexMap = new Map<number, Argument>();

  /** Get the amount of all arguments */
  public get count(): number {
    return this.getAll().length;
  }

  /** Get the argument by key or index */
  public get(key: string): Argument;

  public get(index: number): Argument;

  public get(keyOrIndex: string | number): Argument {
    return this.getInternal(keyOrIndex);
  }

  /** Remove the argument by key or index */
  public remove(key: string): Response;

  public remove(index: number): Response;

  public remove(keyOrIndex: string | number): Response {
    const element = this.getInternal(keyOrIndex);

    if (element) {
      this.removeInternal(element);

      return {
        status: Status.SUCCESS,
        code: 200,
        message: 'Argument succesfully removed',
      };
    }

    return {
      status: Status.FAILURE,
      code: 404,
      message: 'Argument not found',
    };
  }

  /** Get all arguments */
  public getAll(): Argument[] {
    const entriesByKey = Array.from(this.keyMap.values());
    const entriesByIndex = Array.from(this.indexMap.values());

    return _.union(entriesByKey, entriesByIndex);
  }

  /** Remove all arguments */
  public clear(): Response {
    this.indexMap.clear();
    this.keyMap.clear();

    return {
      status: Status.SUCCESS,
      code: 200,
      message: 'Both index and key maps are successfully cleared',
    };
  }

  /** Update existing argument or create new one */
  public upsert(argument: Argument): Response[] {
    const responseList: Response[] = [];

    const argumentByKey = this.getInternal(argument.key);

    if (argumentByKey) {
      this.removeInternal(argumentByKey);

      responseList.push({
        status: Status.SUCCESS,
        code: 200,
        message: `Replaced existing argument with key: ${argument.key}`,
      });
    } else {
      responseList.push({
        status: Status.SUCCESS,
        code: 200,
        message: `Created new argument with key: ${argument.key}`,
      });
    }

    this.keyMap.set(argument.key, argument);

    const argumentByIndex = this.getInternal(argument.key);

    if (argumentByIndex) {
      this.removeInternal(argumentByIndex);

      responseList.push({
        status: Status.SUCCESS,
        code: 200,
        message: `Replaced existing argument with index: ${argument.index}`,
      });
    } else {
      responseList.push({
        status: Status.SUCCESS,
        code: 200,
        message: `Created new argument with index: ${argument.index}`,
      });
    }

    this.indexMap.set(argument.index, argument);

    return responseList;
  }

  /** Get argument from specific map by the key/index, that we provide. */
  private getInternal(keyOrIndex: string | number): Argument {
    if (typeof keyOrIndex === 'number') {
      return this.indexMap.get(keyOrIndex);
    }

    return this.keyMap.get(keyOrIndex);
  }

  /** Remove argument from both key and index maps */
  private removeInternal(argument: Argument): void {
    this.indexMap.delete(argument.index);
    this.keyMap.delete(argument.key);
  }
}
