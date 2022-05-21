import { AxiosResponse } from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertResponseBody(response: AxiosResponse): any {
  return response.data;
}
