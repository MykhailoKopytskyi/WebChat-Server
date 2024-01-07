const configuration = require("../config/config");
const mysql2 = require("mysql2/promise");

const AccountModel = {

  manageAccountCreation: async (username,email) => {
      let connection;
      const connectionObject = configuration.database.connectionObject();
      try {
        connection = await mysql2.createConnection( connectionObject );
        const [rows, fields] = await connection.execute("SELECT 1 FROM User WHERE username = ? OR email = ?", [username,email]);
        console.log(rows)
        console.log(fields)
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
  }

}

module.exports=AccountModel;





















