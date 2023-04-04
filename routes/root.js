//requires
const express = require("express");
const router = express.Router();
const root = require("../controllers/root");
const wrapAsync = require("../factory/wrapAsync");

//root route
router.get("/", wrapAsync(root.root));

//export
module.exports = router;
