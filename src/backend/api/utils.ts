/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError, AxiosResponse } from 'axios';

import { NotFoundError } from './errors';

export function convertResponseBody(response: AxiosResponse): any {
  return response.data;
}

export function convertResponseError(error: AxiosError): any {
  if (!error.response?.data) {
    if (error.response?.status === 404) {
      throw new NotFoundError();
    }
    Promise.reject(error);
  }

  return Promise.reject(error.response.data);
}
