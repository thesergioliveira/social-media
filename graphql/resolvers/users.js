const User = require("../../server/model/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config");
const Users = require("../../server/model/Users");
const { UserInputError } = require("apollo-server");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../server/util/validators");
const { LogTimings } = require("concurrently");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

module.exports = {
  Query: {
    async getUsers() {
      try {
        const users = await User.find();
        console.log(users);
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async login(parent, { username, password }) {
      const { valid, errors } = validateLoginInput(username, password);
      if (!valid) throw new UserInputError("error", { errors });
      const user = await Users.findOne({ username });
      if (!user) {
        errors.general = "User not found!";
        throw new UserInputError("User not found!", { errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong Credentials!";
        throw new UserInputError("Wrong credentials!", { errors });
      }
      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("errors", { errors });
      }
      // Make sure the user does not already exist
      const user = await Users.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken", {
          error: {
            username: "Sorry, this username is already taken :(",
          },
        });
      } else {
        // Encript the password and auth token
        password = await bcrypt.hash(password, 12);
        const newUser = new User({
          email,
          username,
          password,
          createdAt: new Date().toISOString(),
        });
        // Register the used
        const res = await newUser.save();
        const token = generateToken(user);
        return {
          // ...res.doc, ?
          id: res._id,
          email: res.email,
          username: res.username,
          createdAt: res.createdAt,
          token,
        };
      }
    },
  },
};
