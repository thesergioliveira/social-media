const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');

const typeDefs = gql`
  type Query {
    sayHi: String!
  }
`;
const resolvers = {
  Query: {
    sayHi: () => 'This is what the response will send back to the client!',
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
server
  .listen({ port: 5005 })
  .then((res) => console.log(res.url))
  .catch((err) => console.log(`There was an error: ${err.message}`));
