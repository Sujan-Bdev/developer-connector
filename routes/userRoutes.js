const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const validate = require("../utils/validate");

router.post("/signup", validate.createUser, authController.signUp);
router.post("/login", authController.login);

router.route("/").get(authController.protect, userController.getLoggedInUser);

module.exports = router;
