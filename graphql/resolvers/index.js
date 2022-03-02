const postResolvers = require('./post');
const userResolvers = require('./users');

module.exports = {
    Query:{
        ...postResolvers.Query
    }, 
    Mutation: {
        ...userResolvers.Mutation
    }
}