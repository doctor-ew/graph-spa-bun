import { ApolloServer } from 'apollo-server-lambda';
import { APIGatewayProxyEvent, Context, Callback } from 'aws-lambda';
import path from 'path';
import { readFileSync } from 'fs';
import rickMortyResolvers from './graphql/rickmorty/resolvers';
import travelDataResolvers from './graphql/traveldata/resolvers';

// Load type definitions for both endpoints
const rickMortyTypeDefs = readFileSync(path.join(__dirname, 'graphql/rickmorty/schema.graphql'), 'utf-8');
const travelDataTypeDefs = readFileSync(path.join(__dirname, 'graphql/traveldata/schema.graphql'), 'utf-8');

// Create ApolloServer instances for both endpoints
const rickMortyServer = new ApolloServer({
    typeDefs: rickMortyTypeDefs,
    resolvers: rickMortyResolvers,
});

const travelDataServer = new ApolloServer({
    typeDefs: travelDataTypeDefs,
    resolvers: travelDataResolvers,
    context: ({ event }) => ({
        // Add any context setup here when you build out this endpoint
    }),
});

const rickMortyHandler = rickMortyServer.createHandler();
const travelDataHandler = travelDataServer.createHandler();

// Lambda handler
exports.handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    if (event.path === '/rickmorty') {
        return rickMortyHandler(event, context, callback);
    } else if (event.path === '/traveldata') {
        return travelDataHandler(event, context, callback);
    }

    // Default response for unsupported paths
    return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Not Found' }),
    };
};
