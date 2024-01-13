const configuration = require("../config/config");
const mysql2 = require("mysql2/promise");




const messageModel = {

  createMessage: async (message) => {
    let connection;
    const connectionObject = configuration.database.connectionObject();
    try {
      connection = await mysql2.createConnection( connectionObject );
      const SQLstatement = "INSERT INTO Message (message_id, chat_id, message_text, sender_id, status, send_time) VALUES (?,?,?,?,?,?)";
      const params = [message.messageID, message.chatID, message.messageText, message.senderID, message.status, message.sendTime];
      await connection.execute(SQLstatement, params);
      return true;
    }
    catch(e) {
      return false;
    }
    finally {
      connection.end();
    }
  },


  updateMessage: async (message) => {
    let connection;
    const connectionObject = configuration.database.connectionObject();
    try {
      connection = await mysql2.createConnection( connectionObject );
      await connection.execute("UPDATE Message SET status='viewed' WHERE message_id=? ;", [ message.messageID]); 
      const [messageArray, fields] = await connection.execute("SELECT message_id as messageID, sender_id as senderID, chat_id as chatID, message_text as messageText, send_time as sendTime, status FROM Message WHERE message_id=? ;", [message.messageID]);
      if(messageArray.length == 0) {
        return false;
      }
      const updatedMessage = messageArray[0];
      return updatedMessage;
    }
    catch(e) {
      return false;
    }
    finally {
      connection.end();
    }
  },

}


module.exports = messageModel;