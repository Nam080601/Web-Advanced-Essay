const userService = require("../services/user");

const login = async (req, res) => {
  const user = await userService.login(req.body);
  if (user) {
    req.session.current = user.name;
    res.status(200).json({ data: user.name, message: "Login successful" });
  } else {
    res.status(401).json({ message: "Login failded" });
  }
};

const logout = (req, res) => {
  delete req.session.current;
  res.redirect(303, "/login");
};

const register = async (req, res) => {
  const user = await userService.register(req.body);
  if (user) {
    req.session.current = user.name;
    res.status(201).json({ data: user.name, message: "Register successful" });
  } else {
    res.status(401).json({ message: "Register failed" });
  }
};

module.exports = {
  login: login,
  logout: logout,
  register: register,
};
