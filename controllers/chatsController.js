require("dotenv").config();
const cookie = require("cookie");

const jwtManager = require("../utils/jwtManager");
const chatIDManager = require("../utils/chatIDManager");
const chatsModel = require("../models/chatsModel");

const chatsController = {

  createChat: async (request,response) => {
    const authToken = request.cookies.authToken;
    const authData = jwtManager.authorise(authToken, process.env.AUTH_KEY);
    if( !authData ) {
      response.status(401).json({error: "Unauthorised", message: "Token is either expired or invalid"});
      return;
    }
    const friendUserID = request.body.userID;
    if( friendUserID === undefined || friendUserID.length !=36) { // all userID are of length 36
      response.status(400).json({error: "Bad request", message: "Forged request"});
      return;
    }
    const users = [ authData.userID, request.body.userID ];
    const chatID = chatIDManager.generateChatID(users);
    const databaseResult = await chatsModel.createChat(users, chatID);
    if( databaseResult == false ) {
      response.status(400).json({error: "Bad request", message: "Chat already exists or the user does not exist"});
      return;
    }
    response.status(200).json({message: "Chat has been created successfully"});
    return;
  },

  removeChat: async (request, response) => {
    const authToken = request.cookies.authToken;
    const authData = jwtManager.authorise(authToken, process.env.AUTH_KEY);
    if( !authData ) {
      response.status(401).json({error: "Unauthorised", message: "Token is either expired or invalid"});
      return;
    }
    const userID = authData.userID;
    const chatID = request.body.chatID;
    if( !chatID || chatID.length !=72) { // all chatID are of length 72
      response.status(400).json({error: "Bad request", message: "Forged request"});
      return;
    }
    const databaseResult = await chatsModel.removeChat(userID,chatID);
    if( !databaseResult ) {
      response.status(400).json({error: "Bad request", message: "Chat does not exist"});
      return;
    }
    response.status(200).json({message: "Chat has been successfully removed"});
    return;
  },

  searchUsers: async(request, response) => {
    const authToken = request.cookies.authToken;
    const authData = jwtManager.authorise(authToken, process.env.AUTH_KEY);
    if( !authData ) {
      response.status(401).json({error: "Unauthorised", message: "Token is either expired or invalid"});
      return;
    }
    const userID = authData.userID;
    const searchedUsername = request.query.username;

    if(!searchedUsername.trim()) {
      response.status(400).json({error: "Bad request", message: "No matching users"});
      return;
    }
    const databaseResult = await chatsModel.searchUsers(searchedUsername, userID);
    if(!databaseResult) {
      response.status(500).json({error: "Internal server error", message: "Failed to find users"});
      return;
    }
    response.status(200).json(databaseResult);
    return;
  },

  connectToChats: async (socket) =>{
    let authToken;
    try {
      const cookies = socket.handshake.headers.cookie;
      authToken = cookie.parse(cookies).authToken;
    }
    catch(e) {
      socket.emit("error", JSON.stringify({error: "Unauthorised", message:"Log in to the account"}));
      socket.disconnect();
      return false;
    }
  
    const authData = jwtManager.authorise(authToken, process.env.AUTH_KEY);
    if( !authData ) {
      socket.emit("error", JSON.stringify({error: "Unauthorised" ,message:"Token has expired"}));
      socket.disconnect();
      return false;
    }
    const userID = authData.userID;
    const dataSetup = await chatsModel.connectToChats(userID);
    if( !dataSetup ) {
      socket.emit("error", JSON.stringify({ error:"Internal server error", message:"Could not connect to the server"}));
      socket.disconnect();
      return false;
    }
    const chats = dataSetup.chats;
    for( let i = 0; i < chats.length; i++ ) {
      const chatID = chats[i].chatID;
      socket.join(chatID); // connect each user to its room
    }
    socket.emit("initial-setup", JSON.stringify(dataSetup));
    return userID;
  } 
}

module.exports = chatsController;