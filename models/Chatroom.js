const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Chatroom name is required!",
  },
});

module.exports = mongoose.model("Chatroom", chatRoomSchema);
