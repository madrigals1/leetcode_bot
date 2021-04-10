import { GraphQLQuery } from './graphqlQuery.model';

export interface GraphQLContext {
  link: string;
  query: GraphQLQuery,
  headers: Record<string, string>,
}
