import * as _ from 'lodash';

import { ParsedArgument } from './decorators/models';

export default class ArgumentManager {
  keyMap = new Map<string, ParsedArgument>();

  indexMap = new Map<number, ParsedArgument>();

  // Get element by key or index
  get(kex: string | number): ParsedArgument {
    if (typeof kex === 'number') {
      return this.indexMap.get(kex);
    }

    if (typeof kex === 'string') {
      return this.keyMap.get(kex);
    }

    return undefined;
  }

  // Get and remove element by key or index
  pop(kex: string | number): ParsedArgument {
    const element = this.get(kex);

    if (element) this.remove(element);

    return element;
  }

  // Get all elements
  getAll(): ParsedArgument[] {
    const entriesByKey = Array.from(this.keyMap.values());
    const entriesByIndex = Array.from(this.indexMap.values());

    return _.union(entriesByKey, entriesByIndex);
  }

  // Remove all elements
  clear(): void {
    this.indexMap.clear();
    this.keyMap.clear();
  }

  // Update existing argument or create new one
  upsert(argument: ParsedArgument): ParsedArgument[] {
    this.indexMap.set(argument.index, argument);
    this.keyMap.set(argument.key, argument);

    return this.getAll();
  }

  // Remove whole element
  remove(argument: ParsedArgument): ParsedArgument[] {
    this.indexMap.delete(argument.index);
    this.keyMap.delete(argument.key);

    return this.getAll();
  }
}
