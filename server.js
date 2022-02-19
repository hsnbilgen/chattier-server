require("dotenv").config();

// mongoose schemas
require("./models/User");
require("./models/Chatroom");
require("./models/Message");

const mongoose = require("mongoose");
require("./config/mongo");
const jwt = require("jsonwebtoken");
const app = require("./app");


const server = app.listen(8080, () => {
  console.log("Server running on localhost:8080");
});

const io = require("socket.io")(server, {
  allowEIO3: true,
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const Message = mongoose.model("Message");
const User = mongoose.model("User");

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = payload.id;
    next();
  } catch (err) {}
});

io.on("connection", (socket) => {
  console.log("Connected: " + socket.userId);

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userId);
  });

  socket.on("joinRoom", ({ chatroomId, name }) => {
    socket.join(chatroomId);
    socket.to(chatroomId).broadcast.emit("User joined to channel: ", name)
    console.log("User joined to channel " + chatroomId);
  });

  socket.on("userOnline", ({ chatroomId, name }) => {
    socket.join(chatroomId);
    socket.to(chatroomId).broadcast.emit("User is now online: ", name)
    console.log("User is now online: " + name);
  });

  socket.on("userRegistered", ({ chatroomId, name }) => {
    socket.join(chatroomId);
    socket.to(chatroomId).broadcast.emit("New user registered: ", name)
    console.log("New user registered: " + name);
  });

  socket.on("leaveRoom", ({ chatroomId, name }) => {
    socket.leave(chatroomId);
    socket.to(chatroomId).broadcast.emit("User left channel: ", name)
    console.log("User left channel " + chatroomId);
  });

  socket.on("chatroomMessage", async ({ chatroomId, message }) => {
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId });
      const newMessage = new Message({
        chatroom: chatroomId,
        user: socket.userId,
        message,
      });
      io.to(chatroomId).emit("newMessage", {
        message,
        name: user.name,
        userId: socket.userId,
      });
      await newMessage.save();
    }
  });
});
