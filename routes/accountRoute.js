const express = require("express");
const router = express.Router();

const accountController = require("../controllers/accountController");




router.post("/", accountController.manageAccountCreation)  // manages account creation

router.delete( "/", (request, response) => {  // manages account removal

} )


router.get("/registration-confirmation", (request, response) => {   // creates account

})

router.get("/removal-confirmation", (request,response) => {   // removes an account

})

router.post("/session", ( request, response ) => {    // signs in a user

})

router.delete( "/session", (request, response) => {  // signs out a user

} )


module.exports = router;