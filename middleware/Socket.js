const { Server } = require("socket.io");
const config = require("config");

class Socket {
  constructor() {
    this.io;
  }

  static initialize(server) {

    this.io = new Server(server, {
      cors: {
        origin: config.frontendUrl,
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
      },
      allowEIO3: true
    });

    this.io.on("connection", (socket) => {

      console.log("socket.io is connected", socket.id);

      socket.on("newUser", (userId) => {
        addNewUser(userId, socket.id);
      });

      socket.on("notification", (data) => {
        const receiver = getUser(data.userId);
        this.io.to(receiver.socketId).emit("getNotification", data);
      });

      socket.on("disconnect", () => {
        removeUser(socket.id);
      });
    });
  }
}

let onlineUsers = [];

const addNewUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

module.exports = Socket;
