const express = require("express");
const router = express.Router();
const chatsController = require("../controllers/chatsController");

router.post("/", chatsController.createChat ) // create a chat

router.delete("/", chatsController.removeChat ) // remove a chat

router.get("/search", chatsController.searchUsers) // returns an array of users





module.exports = router;