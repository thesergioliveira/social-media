const Post = require('../../server/model/Post');

module.exports = {
  Query: {
      async getPosts () {
          try{
            const post = await Post.find();
            return post;
          } catch (err) {
              throw new Error(err);
          }
      }
  },
};
