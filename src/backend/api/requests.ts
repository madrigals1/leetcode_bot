/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosRequestConfig } from 'axios';

import { log } from '../../utils/helper';
import { authAxios } from '../axios/authAxios';

import { convertResponseBody, convertResponseError } from './utils';

export class Requests {
  static async get(url: string, config?: AxiosRequestConfig): Promise<any> {
    return authAxios
      .get(url, config)
      .then(convertResponseBody)
      .catch(convertResponseError);
  }

  static async post(
    url: string,
    body: unknown,
    config?: AxiosRequestConfig,
  ): Promise<any> {
    return authAxios
      .post(url, body, config)
      .then(convertResponseBody)
      .catch(convertResponseError);
  }

  static async delete(url: string, config?: AxiosRequestConfig): Promise<any> {
    return authAxios
      .delete(url, config)
      .then(convertResponseBody)
      .catch(convertResponseError);
  }

  static async patch(
    url: string,
    body: unknown,
    config?: AxiosRequestConfig,
  ): Promise<any> {
    return authAxios
      .patch(url, body, config)
      .then(convertResponseBody)
      .catch(convertResponseError);
  }
}

export class Service<M> {
  url = '';

  constructor(url: string) {
    this.url = url;
  }

  async create(instance: M, config?: AxiosRequestConfig): Promise<M> {
    return Requests
      .post(`${this.url}/`, instance, config);
  }

  async get(id: number, config?: AxiosRequestConfig): Promise<M> {
    return Requests
      .get(`${this.url}/${id}/`, config);
  }

  async fetch(config?: AxiosRequestConfig): Promise<M[]> {
    return Requests
      .get(`${this.url}/`, config)
      .then((res) => res.results)
      .catch((err) => {
        log(err);
        return [];
      });
  }

  async update(
    id: number,
    instance: M,
    config?: AxiosRequestConfig,
  ): Promise<M> {
    return Requests
      .patch(`${this.url}/${id}/`, instance, config);
  }

  async delete(id: number, config?: AxiosRequestConfig): Promise<boolean> {
    return Requests
      .delete(`${this.url}/${id}/`, config)
      .then(() => true);
  }
}
