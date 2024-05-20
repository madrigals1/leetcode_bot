export interface RequestedArgument {
  key: string;
  name: string;
  index?: number; // 0 by default
  isRequired?: boolean;
  isMultiple?: boolean;
}

export class Argument {
  public index: number;

  public key: string;

  public name: string;

  public size: number;

  private _value: string | string[];

  constructor({
    index,
    key,
    name,
    size,
    value,
  }: {
    index: number;
    key: string;
    name: string;
    size: number;
    value: string | string[];
  }) {
    this.index = index;
    this.key = key;
    this.name = name;
    this.size = size;

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
