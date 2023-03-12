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

//delete post
router.delete('/:id/delete', isLoggedIn, wrapAsync(posts.deletePost));

//update post
router.put('/:id', isLoggedIn, upload.array('images'), validateLocations, wrapAsync(posts.updatePost));
router.get('/edit/:id', isLoggedIn, wrapAsync(posts.renderEditForm));

//new post
router.get('/new', isLoggedIn, posts.renderNewForm);
router.post('/', isLoggedIn, upload.array('images'), validateLocations, wrapAsync(posts.createNewPost));

//post id
router.get('/:id', wrapAsync(posts.Id));

//posts index
router.get('/', wrapAsync(posts.index));

//export
module.exports = router;