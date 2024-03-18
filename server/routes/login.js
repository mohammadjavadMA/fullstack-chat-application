const { Router } = require("express");
const signupController = require("../controllers/signinController");
const verifyToken = require("../controllers/verifyToken");

const router = new Router();

router.post("/login", signupController);

router.post("/verify-token", verifyToken);

module.exports = router;
