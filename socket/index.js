const { Server } = require("socket.io");
const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];
let messages = [];
const addNewUser = (username, avatar, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, avatar, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const addMessages = (username, message) => {
  const user = getUser(username);
  const payload = {
    user: {
      username: user.username,
      avatar: user.avatar,
      socketId: user.socketId,
    },
    message: {
      content: message,
    },
  };
  messages.push(payload);
};
const getUser = (username) =>
  onlineUsers.find((user) => user.username === username);

io.on("connection", (socket) => {
  socket.on("newUser", ({ user: username, avatar }) => {
    addNewUser(username, avatar, socket.id);
    io.emit("onlineUsers", onlineUsers);
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("onlineUsers", onlineUsers);
  });

  socket.on("newMessage", ({ user: username, message }) => {
    addMessages(username, message);
    io.emit("chatMessages", messages);
  });
});
io.listen(8000);
