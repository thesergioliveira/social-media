const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');
const { DB_URL } = require('./config.js');

// DB models
const Post = require('./server/model/Post');
const User = require('./server/model/Users');

// Importing the typeDefs
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');


const server = new ApolloServer({
  typeDefs,
  resolvers,
});
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to the Database!');
    return server.listen({ port: 5005 });
  })
  .then((res) => console.log(res.url))
  .catch((err) => console.log(`There was an error: ${err.message}`));
