require("dotenv").config();

const accountModel = require("../models/accountModel");
const validationManager = require("../utils/validationManager");
const encryptionManager = require("../utils/encryptionManager");
const jwtManager = require("../utils/jwtManager");
const emailManager = require("../utils/emailManager");

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

    const encryptionPassword = encryptionManager.encrypt(password, process.env.PASSWORD_ENCRYPTION_KEY);
    if( !encryptionPassword ) {
      response.status(500).send("Internal server error");
      return;
    }
    const credentials = {
      username,
      email,
      encryptionPassword
    }

    const token = jwtManager.createJWT(credentials, process.env.REGISTRATION_KEY, 3600 * 24);
    if(!token) {
      response.status(500).send("Internal server error");
      return;
    }
    const URL = `http://localhost:6000/account/registration-confirmation?token=${token}`;

    
    emailManager.sendEmail(email, "Registration", URL)
    .then( () => {
      response.status(200).send("Click on the link we sent you via email");
      return;
    } )
    .catch( () => {
      response.status(500).send("Internal server error. Failed to send an email");
      return;
    } )
  } 

}



module.exports = accountController;
























