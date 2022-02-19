const express = require("express");

const app = express();
const errorHandlers = require("./handler/errorHandler");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require("cors")());

// routers
app.use("/user", require("./routers/user"));
app.use("/user/:id", require("./routers/user"));
app.use("/chatroom", require("./routers/chatroom"));

//Error Handlers
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongoseErrors);
if (process.env.ENV === "DEV") {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.prodErrors);
}

module.exports = app;
