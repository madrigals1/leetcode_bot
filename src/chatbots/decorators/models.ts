export interface ParsedArgument {
  index: number;
  key: string;
  name?: string;
  value: string | string[];
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
