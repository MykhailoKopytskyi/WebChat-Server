require("dotenv").config();
const cookieParser = require("cookie-parser");

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const accountRoute = require("./routes/accountRoute");
const chatsRoute = require("./routes/chatsRoute");

app.use(express.json()); // to access URL parameters
app.use(cookieParser({httpOnly:true})); // client side JS can not access cookies

app.use("/account", accountRoute);
app.use("/chats", chatsRoute);



io.on("connection", (socket) => {
  console.log("Hellonhhhhh")
  socket.emit("serverMessage","I am here !!");
  console.log(sendEmail)

  
});

httpServer.listen(parseInt(process.env.PORT));
























