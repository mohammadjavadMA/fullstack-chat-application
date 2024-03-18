const { Router } = require("express");
const getUserInfo = require("../controllers/getUserInfo");
const getContacts = require("../controllers/getContactsController");
const getUserProfile = require("../controllers/getUserProfileController");
const getChats = require("../controllers/getChatsController");
const getOnlineUser = require("../controllers/getOnlineUserController");

const router = new Router();

router.post("/get-contacts", getContacts);

router.post("/get-chat", getChats);

router.post("/get-user-info", getUserInfo);

router.post("/get-user-photo", getUserProfile);

router.post("/check-online", getOnlineUser);

module.exports = router;
