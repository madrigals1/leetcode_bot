import { Status } from './status';

export interface Response {
  status: Status;
  code: number;
  message: string;
}
