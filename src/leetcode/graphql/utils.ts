import axios from 'axios';

import { GraphQLContext } from '../models';
import { log } from '../../utils/helper';

export default async function gqlQuery<T>(context: GraphQLContext): Promise<T> {
  const { link, query, headers } = context;

  return axios
    .post(link, query, { headers })
    .then((graphQLResponse) => graphQLResponse.data.data)
    .catch((err) => log(err));
}
