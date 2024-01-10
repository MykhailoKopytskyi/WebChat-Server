require("dotenv").config();
const crypto = require("crypto");

const accountModel = require("../models/accountModel");
const validationManager = require("../utils/validationManager");
const encryptionManager = require("../utils/encryptionManager");
const jwtManager = require("../utils/jwtManager");
const emailManager = require("../utils/emailManager");
const hashManager = require("../utils/hashManager");

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
    const registrationData = {
      username,
      email,
      password: encryptedPassword
    }

    const registrationToken = jwtManager.createJWT(registrationData, process.env.REGISTRATION_KEY, parseInt(process.env.REGISTRATION_KEY_EXPIRE) );
    if(!registrationToken) {
      response.status(500).send("Internal server error");
      return;
    }
    const URL = `http://localhost:${process.env.PORT}/account/registration-confirmation?token=${registrationToken}`;

    
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
    const regestrationToken = request.query.token;
    const registrationData = jwtManager.authorise(regestrationToken, process.env.REGISTRATION_KEY); // returns either data or false 
    if(registrationData == false) {
      response.status(401).send("Token is either expired or invalid");
      // response.redirect("http://localhost:5000/account/registration-confirmation?success=false")
      // Line 74 will be tested only when the client side of the app is coded
      // For now I will simplify down to Line 73
      return;
    }
    const decryptedPassword = encryptionManager.decrypt(registrationData.password, process.env.PASSWORD_ENCRYPTION_KEY);
    const hashedPassword = await hashManager.hash(decryptedPassword);
    const uuid = crypto.randomUUID();
    const databaseResult = await accountModel.createAccount(uuid, registrationData.username, registrationData.email, hashedPassword);
    // response.redirect(`http://localhost:5000/account/registration-confirmation?success=${databaseResult}`);
    // Line 83 will be tested only when the client side of the app is coded
    // For now I will simplify down to Lines 86-91
    if(databaseResult) {
      response.status(200).send("Account was created successfully");
      return;
    }
    response.status(500).send("Account was not created. Try again");
    return;
  },






  manageAccountRemoval: async (request, response) => {
    const authToken = request.cookies.authToken;
    const authData = jwtManager.authorise(authToken, process.env.AUTH_KEY); // returns data or false

    if(authData == false) {
      response.status(401).send("Unauthorised");
      return;
    }
    const credentials = {
      userID: authData.userID
    }
    const removalToken = jwtManager.createJWT(credentials, process.env.REMOVAL_KEY, parseInt(process.env.REMOVAL_KEY_EXPIRE));
    const URL = `http://localhost:5000/account/removal-confirmation?token=${removalToken}`;
    emailManager.sendEmail( authData.email, "Removal of account", URL )
    .then( () => {
      response.status(200).send("Click on the link we sent you via email");
      return;
    } )
    .catch( () => {
      response.status(500).send("Internal server error. Failed to send an email");
      return;
  } )
  },





  removeAccount: async( request, response ) => {
    const removalToken = request.query.token;
    const removalData = jwtManager.authorise(removalToken, process.env.REMOVAL_KEY);
    if( removalData == false ) {
      // response.redirect( "http://localhost:5000/account/removal-confirmation?success=false" )
      response.status(401).send("Token is expired or invalid");
    }
    const userID = removalData.userID;
    const databaseResult = await accountModel.removeAccount(userID);
    // response.redirect(`http://localhost:5000/account/removal-confirmation?success=${databaseResult}`);
    if( databaseResult ) {
      response.cookie("authToken", "");
      response.status(200).send("Account has been removed successfully");
      return;
    }
    response.status(500).send("Account has not been removed. Try again");
    return;
  },







  createSession: async (request,response) => {
    let authToken = request.cookies.authToken;
    const authData = jwtManager.authorise(authToken, process.env.AUTH_KEY);
    if( authData != false ) {
      response.status(200).send("Authenticated");
      return;
    }
    const email = request.body.email;
    const password = request.body.password;

    const emailValidation = validationManager.emailValidation(email);
    const passwordValidation = validationManager.passwordValidation(password);

    if( emailValidation == false || passwordValidation == false ) {
      response.status(400).send("Credentials do not meet the format");
      return;
    }

    const databaseResult = await accountModel.createSession(email, password);
    if(databaseResult.length == 0) {
      response.status(401).send("Unauthenticated");
      return;
    }

    const hashedDatabasePassword = databaseResult[0].password;
    const userID = databaseResult[0].user_id;
    
    const passwordComparison = await hashManager.compareHash(password, hashedDatabasePassword);
    
    if( passwordComparison == false ) {
      response.status(401).send("Unauthenticated");
      return;
    }

    const credentials = {
      email,
      userID
    }

    authToken = jwtManager.createJWT(credentials, process.env.AUTH_KEY,parseInt( process.env.AUTH_KEY_EXPIRE));
    response.cookie("authToken", "");
    response.cookie("authToken", authToken);
    response.status(200).send("Authenticated");
    return;
  },




  removeSession: async( request, response ) => {
    response.cookie("authToken", "");
    response.status(200).send("Signed out");
    return;
  }
}


module.exports = accountController;
























