const mongoose = require("mongoose");
const Chatroom = mongoose.model("Chatroom");

exports.createChatroom = async (req, res) => {
  const { name } = req.body;

  const nameRegex = /^[A-Za-z\s]+$/;

  if (!nameRegex.test(name)) throw "Chatroom name can only contain alphabets.";

  const chatroomExists = await Chatroom.findOne({ name });

  if (chatroomExists) throw "Chatroom already exists!";

  const chatroom = new Chatroom({
    name,
  });

  await chatroom.save();

  res.json({
    status: 200,
    message: "OK",
    data:{
      message: "Chatroom: [" + chatroom.name + "] created!",
    }
  });
};

exports.getAllChatrooms = async (req, res) => {
  const chatrooms = await Chatroom.find({});

  res.json({
    status: 200,
    message: "OK",
    data:{
      chatrooms,
    }
  });
};

exports.getChatroomUsers = async (req, res) =>{
    const chatroomName = req.params.name
    const chatrooms = await Chatroom.findOne({
        name: chatroomName
    });

    res.json({
        status: 200,
        message: "OK",
        data:{
          chatrooms,
        }
      });
}