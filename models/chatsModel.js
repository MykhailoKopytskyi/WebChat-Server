const configuration = require("../config/config");
const mysql2 = require("mysql2/promise");

const chatsModel = {

  createChat: async (users, chatID) => {
    let connection;
    const connectionObject = configuration.database.connectionObject();
    try {
      connection = await mysql2.createConnection( connectionObject );
      await connection.beginTransaction();

      await connection.execute("INSERT INTO Chat (chat_id) VALUES (?)", [chatID]);
      await connection.execute("INSERT INTO User_Chat (user_id, chat_id) VALUES (?, ?), (?, ?)",[users[0], chatID, users[1], chatID]);

      await connection.commit();
      return true;
    }
    catch(e) {
      return false;
    }
    finally {
      connection.end();
    }
  },

  removeChat: async(userID, chatID) => {
    let connection;
    const connectionObject = configuration.database.connectionObject();
    try {
      connection = await mysql2.createConnection(connectionObject);
      await connection.execute( "DELETE FROM Chat WHERE chat_id = ?", [chatID]);
      return true;
    }
    catch(e) {
      return false;
    }
    finally {
      connection.end();
    }
  },

  searchUsers: async (searchedUsername, sender) => {
    let connection;
    const connectionObject = configuration.database.connectionObject();
    try {
      connection = await mysql2.createConnection(connectionObject);
      const SQLstatement = "SELECT username, user_id AS userID FROM User WHERE LOWER(username) LIKE LOWER(?) AND user_id != ? LIMIT 8";
      const [rows, fields] = await connection.execute(SQLstatement, [`%${searchedUsername}%`, sender]);
      return rows;
    }
    catch(e) {
      return false;
    }
    finally {
      connection.end();
    }
  },

  connectToChats: async (userID) => {
    let connection;
    const connectionObject = configuration.database.connectionObject();
    try {
      connection = await mysql2.createConnection(connectionObject);

      const [chatIDArray, fields] = await connection.execute("SELECT chat_id as chatID FROM User_Chat WHERE user_id=?",[userID]);
      // get all chatID of the chats I am participating in
      const parsedChatIDArray = [];
      for(let i =0; i < chatIDArray.length;i++) {
        parsedChatIDArray.push(chatIDArray[i].chatID); // chatIDs must be stored in an array, rather than in an array of objects
      }

      const [usernameArray, usernameFiels] = await connection.execute("SELECT username FROM User WHERE user_id=?",[userID]);
      const username = usernameArray[0].username;
      // get my username
      if(parsedChatIDArray.length == 0) {
        const dataSetup = {
          username,
          chats: [],
          messages: []
        }
        return dataSetup;
      }
      const [messages, messageFields] = await connection.query("SELECT message_id as messageID, sender_id as senderID, chat_id as chatID, message_text as messageText, send_time as sendTime, status FROM Message WHERE chat_id IN (?) ORDER BY send_time ASC", [parsedChatIDArray]);
      // get all messages from the chats I am in. Starting from the oldest messages

      const [chats, chatUserFields] = await connection.query("SELECT User_Chat.chat_id as chatID, User.username FROM User_Chat JOIN User ON User_Chat.user_id = User.user_id WHERE User_Chat.chat_id IN (?) AND User_Chat.user_id != ?", [parsedChatIDArray, userID]);
      // chats: [ {username: "misha", chatID: "73bhu8"}, {username: "", chatID: "dhisiuis"}.... ]

      const dataSetup = {
        username,
        chats,
        messages,
        userID
      }
      return dataSetup;
    }
    catch(e) {
      return false;
    }
    finally {
      connection.end();
    }
  }
}


module.exports = chatsModel;