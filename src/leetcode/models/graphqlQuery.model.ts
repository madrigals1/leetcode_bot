export interface GraphQLQuery {
  operationName: string,
  query: string,
  variables: Record<string, string>,
}
