//imports
const express = require("express");
const wrapAsync = require("../factory/wrapAsync");
const router = express.Router();
const { isLoggedIn } = require("../factory/middleware");
const users = require("../controllers/users");

//render
router.get("/dashboard", isLoggedIn, wrapAsync(users.renderDashboardPage));

//export
module.exports = router;
