//imports
const express = require("express");
let router = express.Router();
const User = require("../models/User");
const wrapAsync = require("../factory/wrapAsync");
const passport = require("passport");
const { session } = require("passport");
const { checkReturnTo } = require("../factory/middleware");
const users = require("../controllers/users");

//routes
//register
router.get("/register", users.renderRegisterPage);
router.post("/register", wrapAsync(users.registerUser));

//login
router.get("/login", users.renderLoginPage);
router.post("/renderLogin", users.renderLogic);
router.post(
  "/login",
  checkReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.login
);

//logout
router.get("/logout", users.logout);

//export
module.exports = router;
