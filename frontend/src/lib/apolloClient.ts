// src/lib/apolloClient.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
    uri: 'http://background:4000/graphql', // Replace with your GraphQL endpoint
    cache: new InMemoryCache(),
});
