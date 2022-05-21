const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const session = require("express-session");

require("dotenv").config();

const indexRoute = require("./app/routes/index");
const userRoute = require("./app/routes/user");

const auth = require("./app/middlewares/auth");

const regChatHandler = require("./socket");

app.set("view engine", "ejs");
app.set("views", "app/views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.path}`);
//   next();
// });
app.use(auth);

indexRoute(app);
userRoute(app);

io.on("connection", (socket) => {
  regChatHandler(io, socket);
});

server.listen(process.env.PORT, () => {
  console.log("Server running at port 5000");
});
