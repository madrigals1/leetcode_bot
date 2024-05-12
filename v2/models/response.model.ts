import { Status } from './status.model';

export interface Response<T> {
  status: Status;
  code: number;
  message: string;
  payload?: T;
}
