function generateChatID(users) {
  let chatID;
  for( let i = 0; i < users[0].length; i++ ) {
    if( users[0][i].charCodeAt() > users[1][i].charCodeAt() ) {
      chatID = users[0] + users[1];
      return chatID
    }
    else if ( users[0][i].charCodeAt() < users[1][i].charCodeAt() )
      chatID = users[1] + users[0];
      return chatID;
  }
}

module.exports = {generateChatID};