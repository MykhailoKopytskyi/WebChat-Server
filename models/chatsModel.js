const configuration = require("../config/config");
const mysql2 = require("mysql2/promise");



const chatsModel = {

  createChat: async (users, chatID) => {
    let connection;
    const connectionObject = configuration.database.connectionObject();
    try {
      connection = await mysql2.createConnection( connectionObject );
      connection.beginTransaction();

      await connection.execute("INSERT INTO Chat (chat_id) VALUES (?)", [chatID]);
      await connection.execute("INSERT INTO User_Chat (user_id, chat_id) VALUES (?, ?), (?, ?)",[users[0], chatID, users[1], chatID]);

      connection.commit();
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
      await connection.execute( "DELETE FROM User_Chat WHERE user_id = ? AND chat_id = ?", [userID,chatID]);
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
      const SQLstatement = "SELECT username FROM User WHERE LOWER(username) LIKE LOWER(?) AND user_id != ? LIMIT 8";
      const [rows, fields] = await connection.execute(SQLstatement, [`%${searchedUsername}%`, sender]);
      return rows;
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