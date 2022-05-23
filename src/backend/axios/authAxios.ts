import axios from 'axios';

import { log } from '../../utils/helper';
import { constants } from '../../utils/constants';

const { LBB } = constants;

const authAxios = axios.create({
  baseURL: `${LBB.URL}/api/v1`,
  timeout: 15000,
});

authAxios.interceptors.request.use(
  async (config) => {
    const token = `${LBB.USERNAME}:${LBB.PASSWORD}`;
    const encodedToken = Buffer.from(token).toString('base64');
    return {
      ...config,
      headers: {
        Authorization: `Basic ${encodedToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
  },
  (error) => log(error),
);

export { authAxios };
