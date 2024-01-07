require("dotenv").config();

const accountModel = require("../models/accountModel");
const validationManager = require("../utils/validationManager");
const encryptionManager = require("../utils/encryptionManager");
const jwtManager = require("../utils/jwtManager");
const emailManager = require("../utils/emailManager");
const hashManager = require("../utils/hashManager");
const crypto = require("crypto");

const accountController = {

  manageAccountCreation: async ( request, response ) => {
    const email = request.body.email;
    const username = request.body.username;
    const password = request.body.password;

    const emailValidation = validationManager.emailValidation(email);
    const usernameValidation = validationManager.usernameValidation(username);
    const passwordValidation = validationManager.passwordValidation(password);

    if(emailValidation == false || usernameValidation == false || passwordValidation == false ) {
      response.status(400).send("Credentials do not meet the format");
      return;
    }

    const result = await accountModel.manageAccountCreation(username, email);
    if(result == false) {
      response.status(409).send("Username or email already exist");
      return;
    }

    const encryptedPassword = encryptionManager.encrypt(password, process.env.PASSWORD_ENCRYPTION_KEY);
    if( !encryptedPassword ) {
      response.status(500).send("Internal server error");
      return;
    }
    const credentials = {
      username,
      email,
      password: encryptedPassword
    }

    const token = jwtManager.createJWT(credentials, process.env.REGISTRATION_KEY, parseInt(process.env.REGISTRATION_KEY_EXPIRE) );
    if(!token) {
      response.status(500).send("Internal server error");
      return;
    }
    const URL = `http://localhost:${process.env.PORT}/account/registration-confirmation?token=${token}`;

    
    emailManager.sendEmail(email, "Registration", URL)
    .then( () => {
      response.status(200).send("Click on the link we sent you via email");
      return;
    } )
    .catch( () => {
      response.status(500).send("Internal server error. Failed to send an email");
      return;
    } )
  } ,






  createAccount: async (request,response) => {
    const token = request.query.token;
    const authToken = jwtManager.authorise(token, process.env.REGISTRATION_KEY); // returns either data or false 
    if(authToken == false) {
      response.send("Token is either expired or invalid");
      // response.redirect("http://localhost:5000/account/registration-confirmation?success=false")
      // Line 71 will be tested only when the client side of the app is coded
      // For now I will simplify down to Line 70
      return;
    }
    const decryptedPassword = encryptionManager.decrypt(authToken.password, process.env.PASSWORD_ENCRYPTION_KEY);
    const hashedPassword = await hashManager.hash(decryptedPassword);
    const uuid = crypto.randomUUID();
    const databaseResult = await accountModel.createAccount(uuid, authToken.username, authToken.email, hashedPassword);
    // response.redirect(`http://localhost:5000/account/registration-confirmation?success=${databaseResult}`);
    // Line 90 will be tested only when the client side of the app is coded
    // For now I will simplify down to Lines 93-98
    if(databaseResult) {
      response.send("Account was created successfully");
      return;
    }
    response.send("Account was not created. Try again");
    return;
  }
}


module.exports = accountController;
























