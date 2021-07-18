import { User } from '../../leetcode/models';

export interface ReplyMarkupCommand {
  text: string,
  action: string,
}

export interface ReplyMarkupOptions {
  isOnlyHeader?: boolean,
  users?: User[],
  header?: string,
  footer?: string,
  command: string,
  password?: string,
  commands?: ReplyMarkupCommand[],
}
