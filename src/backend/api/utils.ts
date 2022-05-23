/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError, AxiosResponse } from 'axios';

export function convertResponseBody(response: AxiosResponse): any {
  return response.data;
}

export function convertResponseError(error: AxiosError): any {
  if (!error.response?.data) {
    Promise.reject(error);
  }

  return Promise.reject(error.response.data);
}
