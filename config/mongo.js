require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.once("open", () => {
  console.log("MongoDB Connection is Open!");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection err: " + err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB Connection is disconnected!");
});
