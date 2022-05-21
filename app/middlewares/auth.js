module.exports = (req, res, next) => {
  const authRoute = ["GET /", "GET /logout"];
  const unAuthRoute = [
    "GET /login",
    "GET /register",
    "POST /login",
    "POST /register",
  ];
  const user = req.session.current;

  if (!user && !unAuthRoute.includes(`${req.method} ${req.path}`)) {
    return res.redirect("/login");
  }
  if (user && !authRoute.includes(`${req.method} ${req.path}`)) {
    return res.redirect("/");
  }
  next();
};
