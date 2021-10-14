export interface ParsedArgument {
  index: number;
  key: string;
  name?: string;
  value: string | string[];
}

export interface ActionContext {
  name: string,
  argsCount: number[] | string,
  isAdmin?: boolean,
}
