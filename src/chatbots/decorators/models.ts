export interface IParsedArgument {
  index: number;
  key: string;
  name?: string;
}

export interface Argument {
  key: string;
  name: string;
  index: number;
  isRequired?: boolean;
  isMultiple?: boolean;
}

export interface ActionContext {
  name: string;
  args?: Argument[];
  isAdmin?: boolean;
}

export class ParsedArgument implements IParsedArgument {
  index: number;

  key: string;

  name: string;

  private _value: string | string[];

  constructor(
    index: number,
    key: string,
    name: string,
    value: string | string[],
  ) {
    this.index = index;
    this.key = key;
    this.name = name;

    // All arguments should be converted to lowercase
    if (typeof value === 'string') {
      this._value = value.toLowerCase();
    } else {
      this._value = value.map((elem) => elem.toLowerCase());
    }
  }

  public get value(): string {
    if (typeof this._value === 'string') {
      return this._value;
    }

    return this._value.join(' ');
  }

  public get values(): string[] {
    if (typeof this._value === 'string') {
      return [this._value];
    }

    return this._value;
  }
}
