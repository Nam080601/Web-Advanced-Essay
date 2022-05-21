const bcrypt = require("bcrypt");
const userModel = require("../models/user");

const login = async (input) => {
  const { username, password } = input;
  const user = await userModel
    .findOne({
      username: username,
    })
    .exec();
  const valid = bcrypt.compareSync(password, user.password);
  if (valid) {
    return user;
  } else {
    return null;
  }
};

const register = (input) => {
  const { username, password, name } = input;
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  return userModel.create({
    username: username,
    password: hashPassword,
    name: name,
  });
};

module.exports = { login: login, register: register };
