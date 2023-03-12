//imports
const express = require('express');
const app = express();
const FindrLocation = require('../models/dbFindrModel');
const AppError = require('../factory/AppError');
const wrapAsync = require('../factory/wrapAsync');
const router = express.Router({mergeParams: true});
const { isLoggedIn, validateLocations } = require('../factory/middleware');
const posts = require('../controllers/posts');
const multer  = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });
const User = require('../models/User');
const passport = require('passport');
const { session } = require('passport');
const { checkReturnTo } = require('../factory/middleware');
const users = require('../controllers/users');

//render
router.get('/dashboard', isLoggedIn, wrapAsync (users.renderDashboardPage));