import { authAxios } from '../axios/authAxios';
import { LBBSubscription } from '../models';

import { convertResponseBody } from './utils';

type M = LBBSubscription;
const model = '/subscriptions';
class Requests {
  static async get(url: string) {
    return authAxios
      .get<M>(url)
      .then(convertResponseBody);
  }

  static async post(url: string, body: M) {
    return authAxios
      .post<M>(url, body)
      .then(convertResponseBody);
  }

  static async delete(url: string) {
    return authAxios
      .delete<M>(url)
      .then(convertResponseBody);
  }

  static async patch(url: string, body: M) {
    return authAxios
      .patch<M>(url, body)
      .then(convertResponseBody);
  }
}

export class SubscriptionService {
  static create(book: M): Promise<M> {
    return Requests.post(model, book);
  }

  static get(id: number): Promise<M> {
    return Requests.get(`${model}/${id}`);
  }

  static fetch(): Promise<M[]> {
    return Requests.get(model);
  }

  static update(id: number, book: M): Promise<M> {
    return Requests.patch(`${model}/${id}`, book);
  }

  static delete(id: number): Promise<M> {
    return Requests.delete(`${model}/${id}`);
  }
}
