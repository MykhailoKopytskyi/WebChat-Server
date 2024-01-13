const configuration = require("../config/config");
const mysql2 = require("mysql2/promise");

const AccountModel = {

  manageAccountCreation: async (username,email) => {
      let connection;
      const connectionObject = configuration.database.connectionObject();
      try {
        connection = await mysql2.createConnection( connectionObject );
        const [rows, fields] = await connection.execute("SELECT 1 FROM User WHERE username = ? OR email = ?", [username,email]);
        if( rows.length  == 0) { // If nothing is found, hence, email and username are unique
          return true;
        }
        return false;
      }
      catch(e) {
        return false;
      }
      finally {
          connection.end(); // Close a DB connection
      }
  },





  createAccount: async (user_id, username,email, password) => {
    let connection;
    const connectionObject = configuration.database.connectionObject();
    try {
      connection = await mysql2.createConnection( connectionObject );
      await connection.execute('INSERT INTO User (user_id, username, email, password) VALUES (?, ?, ?, ?)', [user_id,username,email,password]);
      return true;
    }
    catch(e) {
      return false;
    }
    finally {
      connection.end();
    }
  },




  removeAccount: async (user_id) => {
    let connection;
    const connectionObject = configuration.database.connectionObject();
    try {
      connection = await mysql2.createConnection(connectionObject);
      await connection.execute("DELETE FROM User WHERE user_id = ?", [user_id]);
      return true;
    }
    catch(e) {
      return false;
    }
    finally {
      connection.end();
    }
  },





  createSession: async (email) => {
    let connection;
    const connectionObject = configuration.database.connectionObject();
    try {
      connection = await mysql2.createConnection(connectionObject);
      const [rows,fields] = await connection.execute( "SELECT password,user_id as userID FROM User WHERE email=?", [email] );
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

module.exports=AccountModel;





















