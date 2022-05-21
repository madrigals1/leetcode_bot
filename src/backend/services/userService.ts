import { authAxios } from '../axios/authAxios';
import { LBBUser } from '../models';

import { convertResponseBody } from './utils';

type M = LBBUser;

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

export class UserService {
  static model = 'users';

  static create(book: M): Promise<M> {
    return Requests.post(this.model, book);
  }

  static get(id: number): Promise<M> {
    return Requests.get(`${this.model}/${id}`);
  }

  static fetch(): Promise<M[]> {
    return Requests.get(this.model);
  }

  static update(id: number, book: M): Promise<M> {
    return Requests.patch(`${this.model}/${id}`, book);
  }

  static delete(id: number): Promise<M> {
    return Requests.delete(`${this.model}/${id}`);
  }
}
