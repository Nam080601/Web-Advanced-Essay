const listUsers = [];

module.exports = (io, socket) => {
  const clients = [];
  // User connect
  socket.on("connected", async (user) => {
    clients.push({ socket: socket, name: user });
    io.emit("system notify", `${user} connected`);

    listUsers.push(user);
    io.emit("show users", listUsers);
  });

  // User disconnect
  socket.on("disconnect", async () => {
    try {
      const user = await getCurrentUser();
      io.emit("system notify", `${user} disconnected`);

      listUsers.splice(listUsers.indexOf(user), 1);
      io.emit("show users", listUsers);
    } catch (error) {
      console.log(error);
    }
  });

  // User start typing
  socket.on("start typing", async () => {
    try {
      const user = await getCurrentUser();
      io.emit("start typing", user);
    } catch (error) {
      console.log(error);
    }
  });

  // User end typing
  socket.on("end typing", async () => {
    const user = await getCurrentUser();
    io.emit("end typing", user);
  });

  // User chat
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  const getCurrentUser = () => {
    return new Promise((resolve) => {
      clients.forEach((client) => {
        if (client.socket == socket) {
          resolve(client.name);
        }
      });
    });
  };
};
