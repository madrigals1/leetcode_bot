/* eslint-disable @typescript-eslint/no-explicit-any */
import { authAxios } from '../axios/authAxios';

import { convertResponseBody, convertResponseError } from './utils';

export class Requests {
  static async get(url: string): Promise<any> {
    return authAxios
      .get(url)
      .then(convertResponseBody)
      .catch(convertResponseError);
  }

  static async post(url: string, body: unknown): Promise<any> {
    return authAxios
      .post(url, body)
      .then(convertResponseBody)
      .catch(convertResponseError);
  }

  static async delete(url: string): Promise<any> {
    return authAxios
      .delete(url)
      .then(convertResponseBody)
      .catch(convertResponseError);
  }

  static async patch(url: string, body: unknown): Promise<any> {
    return authAxios
      .patch(url, body)
      .then(convertResponseBody)
      .catch(convertResponseError);
  }
}

export class Service<M> {
  url = '';

  constructor(url: string) {
    this.url = url;
  }

  async create(instance: unknown): Promise<M> {
    return Requests.post(`${this.url}/`, instance);
  }

  async get(id: number): Promise<M> {
    return Requests.get(`${this.url}/${id}/`);
  }

  async fetch(): Promise<M[]> {
    return Requests.get(`${this.url}/`);
  }

  async update(id: number, instance: unknown): Promise<M> {
    return Requests.patch(`${this.url}/${id}/`, instance);
  }

  async delete(id: number): Promise<boolean> {
    return Requests.delete(`${this.url}/${id}/`).then(() => true);
  }
}
