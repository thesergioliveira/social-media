const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');
const { DB_URL } = require('./config.js');

// DB models
const Post = require('./server/model/Post');
const User = require('./server/model/Users');

const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  type Query {
    sayHi: String!
    getPost: [Post]
  }
`;
const resolvers = {
  Query: {
    sayHi: () => 'This is what the response will send back to the client!',
    async getPost() {
      try {
        const posts = await Post.find();
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

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
