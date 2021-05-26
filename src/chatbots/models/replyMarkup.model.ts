import { User } from '../../leetcode/models';

export interface ReplyMarkupOptions {
  isOnlyHeader?: boolean,
  users?: User[],
  header?: string,
  footer?: string,
  command: string,
  password?: string,
}
