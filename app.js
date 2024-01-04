const sendEmail = require("./utils/emailManagement");


sendEmail("kopitskyi.michail.49025@gmail.com", "Registration", "google.com")
.then( res => console.log(res) )
.catch( res =>  console.log(res) );












































// const express = require("express");
// const { createServer } = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer);

// const accountRoute = require("./routes/account");
// const chatsRoute = require("./routes/chats");

// app.use("/account", accountRoute);
// app.use("/chats", chatsRoute);



// io.on("connection", (socket) => {
//   console.log("Hellonhhhhh")
//   socket.emit("serverMessage","I am here !!");
//   console.log(sendEmail)

  
// });

// httpServer.listen(6000);





















