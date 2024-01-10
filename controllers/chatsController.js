require("dotenv").config();
const jwtManager = require("../utils/jwtManager");
const chatIDManager = require("../utils/chatIDManager");
const chatsModel = require("../models/chatsModel");




const chatsController = {


  createChat: async (request,response) => {
    const authToken = request.cookies.authToken;
    const authData = jwtManager.authorise(authToken, process.env.AUTH_KEY);
    if( authData == false ) {
      response.status(401).send("Unauthorised");
      return;
    }
    const friendUserID = request.body.userID;
    if( friendUserID === undefined || friendUserID.length !=36) { // all userID are of length 36
      response.status(400).send("Forged request");
      return;
    }
    const users = [ authData.userID, request.body.userID ];
    const chatID = chatIDManager.generateChatID(users);
    const databaseResult = await chatsModel.createChat(users, chatID);
    if( databaseResult == false ) {
      response.status(400).send("Bad request. Chat already exists or the user does not exist");
      return;
    }
    response.status(200).send("Chat has been created successfully");
    return;
  },


  

  removeChat: async (request, response) => {
    const authToken = request.cookies.authToken;
    const authData = jwtManager.authorise(authToken, process.env.AUTH_KEY);
    if( authData == false ) {
      response.status(401).send("Unauthorised");
      return;
    }
    const userID = authData.userID;
    const chatID = request.body.chatID;
    if( chatID === undefined || chatID.length !=72) { // all chatID are of length 72
      response.status(400).send("Forged request");
      return;
    }
    const databaseResult = await chatsModel.removeChat(userID,chatID);
    if( databaseResult == false ) {
      response.status(400).send("Bad request. Chat does not exist");
      return;
    }
    response.status(200).send("Chat has been successfully removed");
    return;
  },



  searchUsers: async(request, response) => {
    const authToken = request.cookies.authToken;
    const authData = jwtManager.authorise(authToken, process.env.AUTH_KEY);
    if( authData == false ) {
      response.status(401).send("Unauthorised");
      return;
    }
    const userID = authData.userID;
    const searchedUsername = request.query.username;

    if(!searchedUsername.trim()) {
      response.send("Nothing is found");
      return;
    }
    const databaseResult = await chatsModel.searchUsers(searchedUsername, userID);
    if(!databaseResult) {
      response.status(500).send("Internal server error");
      return;
    }
    response.status(200).send(databaseResult);
    return;
  }


}


module.exports = chatsController;