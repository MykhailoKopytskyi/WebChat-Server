const configuration = require("../config/config");

const emailValidation = (email) => {
  let emailRegEx = configuration.validation.emailRegExp;
  if( emailRegEx.test(email) == true) {
    return email;
  }
  return false;
}

const passwordValidation = (password) => {
  let passwordRegEx = configuration.validation.passwordRegExp;
  if( passwordRegEx.test(password) == true) {
    return password;
  }
  return false;
}

const usernameValidation = (username) => {
  let usernameRegEx = configuration.validation.usernameRegExp;
  if( usernameRegEx.test(username) == true) {
    return username;
  }
  return false;
}

const messageValidation = (message,userChats) => {
  const messageText = message.messageText;
  const messageID = message.messageID;

  if(!messageText || messageText.length == 0 || messageText.length > 1024) {
    return false;  // forged request
  }
  if(!messageID || messageID.length != 36) {
    return false; // forged request
  }
  const chatID = message.chatID;
  console.log(chatID)
  for( let userChat of userChats ) { // iterate over the chats user is connected to
    if(userChat == chatID) { // if the user is connected to the chat it is sending message to
      console.log(userChat)
      return true;
    }
  }
  return false;
}


module.exports={ emailValidation,passwordValidation, usernameValidation, messageValidation };