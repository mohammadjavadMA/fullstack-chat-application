const { Router } = require("express");
const searchUser = require("../controllers/searchUsers");

const router = new Router();

router.post("/search-user", searchUser);

module.exports = router