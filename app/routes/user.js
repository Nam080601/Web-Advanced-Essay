const userHandler = require("../controllers/user");

const userRoute = (app) => {
  // Login routes
  app.get("/login", (req, res) => {
    res.render("login");
  });
  app.post("/login", userHandler.login);

  // Logout routes
  app.get("/logout", userHandler.logout);

  // Register routes
  app.get("/register", (req, res) => {
    res.render("register");
  });
  app.post("/register", userHandler.register);
};

module.exports = userRoute;
