const mongoose = require("../db");

const userSchema = mongoose.Schema(
  {
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    name: { type: String, require: true },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Users", userSchema);
