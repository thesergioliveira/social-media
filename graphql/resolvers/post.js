const Post = require("../../model/Post");
const checkAuth = require("../../util/check-auth");
const { AuthenticationError } = require("apollo-server");

module.exports = {
  Query: {
    // Adding the query to get all posts
    async getPosts() {
      try {
        // Querying the DB for all post and sorting them from the newest to oldest
        const post = await Post.find().sort({ createdAt: -1 });
        return post;
      } catch (err) {
        throw new Error(err);
      }
    },
    // Adding the query to get a post based on postId
    async getPost(_, { postId }) {
      try {
        // Querying the DB for a post with a specific Id
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    // Adding the mutation to create post
    async createPost(_, { body }, context) {
      // Using the helper function checkAuth to authenticate the user
      const user = checkAuth(context);
      // Using the DB schema in order to create a new post
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      // Saving post to DB
      const post = await newPost.save();
      return post;
    },
    // Adding the mutation to delete post
    async deletePost(_, { postId }, context) {
      // Using the helper function checkAuth to authenticate the user
      const user = checkAuth(context);
      try {
        // Querying the DB for a post with a specific Id
        const postToDelete = await Post.findById(postId);
        // Checking if the post belongs to the user who is trying to delete it
        if (user.username == postToDelete.username) {
          // Removing the post
          await Post.remove({ _id: postId });
          return `The following post was deleted: ${postToDelete.body} `;
        } else {
          throw new AuthenticationError(
            "You do not have authorization to delete this post"
          );
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
