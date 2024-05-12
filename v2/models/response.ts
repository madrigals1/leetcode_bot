import { Status } from './status';

export interface Response<T> {
  status: Status;
  code: number;
  message: string;
  payload?: T;
}
