const messageModel = require("../models/messageModel");
const validationManager = require("../utils/validationManager");


async function messageController(io, socket, userID){

  const createMessage = async (message) => {
    const userChats = socket.rooms;  // type Set
    const messageValidation = validationManager.messageValidation(message, userChats);
    if(!messageValidation) {
      socket.emit("error", "Forged request");
      return;
    }
    message.senderID = userID;
    message.status = "sent";
    message.sendTime = new Date();

    const databaseResult = await messageModel.createMessage(message);
    if(!databaseResult) {
      socket.emit("error", "Internal server error");
      return;
    }
    const chatID = message.chatID;
    io.to(chatID).emit("create-message", message);
    return;
  }





  const updateMessage = async (message) => {
    const userChats = socket.rooms;  // type Set
    const messageValidation = validationManager.messageValidation(message,userChats);
    if(!messageValidation) {
      socket.emit("error", "Forged request");
      return;
    }
    const updatedMessage = await messageModel.updateMessage(message);
    if(!updatedMessage) {
      socket.emit("error", "Internal server error or Forged request");
      return;
    }
    const chatID = updatedMessage.chatID;
    io.to(chatID).emit("update-message", updatedMessage);
    return;
  }



  socket.on("create-message", createMessage);
  socket.on("update-message", updateMessage);
}



module.exports = messageController;