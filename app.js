require("dotenv").config();

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const accountRoute = require("./routes/accountRoute");
const chatsRoute = require("./routes/chatsRoute");

app.use(express.json());

app.use("/account", accountRoute);
app.use("/chats", chatsRoute);



io.on("connection", (socket) => {
  console.log("Hellonhhhhh")
  socket.emit("serverMessage","I am here !!");
  console.log(sendEmail)

  
});

httpServer.listen(parseInt(process.env.PORT));






















