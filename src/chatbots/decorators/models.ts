export interface ActionContext {
  name: string,
  argsCount: number[] | string,
  isAdmin?: boolean,
}
