const express = require("express");
const router = express.Router();

const accountController = require("../controllers/accountController");

router.post("/", accountController.manageAccountCreation)  // manages account creation

router.get("/registration-confirmation", accountController.createAccount) // creates an account

router.delete( "/", accountController.manageAccountRemoval ) // manages account removal

router.get("/removal-confirmation", accountController.removeAccount ) // removes an account

router.post("/session", accountController.createSession ) // signs the user in

router.delete( "/session", accountController.removeSession ) // signs the user out

module.exports = router;