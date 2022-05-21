const indexRoute = (app) => {
  // Index routes
  app.get("/", (req, res) => {
    res.render("index");
  });
};
module.exports = indexRoute;
