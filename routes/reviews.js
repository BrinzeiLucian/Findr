//imports
const express = require('express');
let FindrLocation = require('../models/dbFindrModel');
const AppError = require('../factory/AppError');
const wrapAsync = require('../factory/wrapAsync');
let Review = require('../models/Review');
let router = express.Router({mergeParams: true});
const { isLoggedIn, validateReviews, checkReturnTo } = require('../factory/middleware');
const reviews = require('../controllers/reviews');

//reviews update
router.put('/:id/:reviewId/edit', isLoggedIn, wrapAsync(reviews.editReview));

//edit reviews page
router.get('/:id/:reviewId/edit', isLoggedIn, wrapAsync (reviews.renderReviewEditForm));

//reviews delete
router.delete('/:id/:reviewId/delete', isLoggedIn, wrapAsync(reviews.deleteReview));

//reviews
router.post('/:id', isLoggedIn, validateReviews, wrapAsync(reviews.createReview));

//export
module.exports = router;