const User = require('../../server/model/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../../config');


module.exports = {
    Query: {
       async getUsers(){
            try{
                const users = await User.find();
                console.log(users);
                return users;
            } catch(err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async register(_,
             {
                registerInput: { username, email, password, confirmPassoword}
            },
             context,
             info
              ) {
            // Validate user data
            // Make sure the user does not already exist
            // Encript the password and auth token
            password = await bcrypt.hash(password, 12);
            console.log(email);
            const newUser = new User({
                email, 
                username,
                password,
                createdAt : new Date().toISOString(),
                });

            // Register the used
            const res = await newUser.save() ;   
            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
            }, SECRET_KEY,{expiresIn: '1h'} );
            return{
                // ...res.doc, ?
                id: res._id,
                email: res.email,
                username: res.username,
                createdAt: res.createdAt,
                token
            }
            
        }
    }
    }