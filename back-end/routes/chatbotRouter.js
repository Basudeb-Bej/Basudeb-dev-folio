// routes/chat.js
const express = require("express");
const { handleChat, logLocalMessage } = require("../controllers/chatbotController");

const router = express.Router();
router.post("/", handleChat);
router.post("/log", logLocalMessage);

module.exports = router;