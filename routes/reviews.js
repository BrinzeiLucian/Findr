//requires
const express = require('express');
let FindrLocation = require('../models/dbFindrModel');
const AppError = require('../factory/AppError');
const wrapAsync = require('../factory/wrapAsync');
let Review = require('../models/Review');
let router = express.Router({mergeParams: true});
const { isLoggedIn, validateReviews, checkReturnTo } = require('../factory/middleware');

//reviews update
router.put('/:id/:reviewId/edit', isLoggedIn, validateReviews, wrapAsync(async(req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndUpdate(reviewId, { ...req.body.reviewData }, { runValidators: true, new: true });
    req.flash('success', 'Review successfully edited !');
    res.redirect(`/locations/${id}`);
}));

//edit reviews page
router.get('/:id/:reviewId/edit', isLoggedIn, wrapAsync (async (req, res, next) => {
    let idData = await FindrLocation.findById(req.params.id);
    let reviewData = await Review.findById(req.params.reviewId);
        if(!reviewData){
            throw new AppError('Location not found !', 404);
        };
    res.render('reviews/edit', { pageName: `Edit Reviews`, idData, reviewData });
}));

//reviews delete
router.delete('/:id/:reviewId/delete', isLoggedIn, wrapAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    const reviewData = await Review.findById(reviewId);
    if(!reviewData.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission !');
        return res.redirect(`/locations/${id}`);
    }
    await FindrLocation.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review successfully deleted !');
    res.redirect(`/locations/${id}`);
}));

//reviews
router.post('/:id', isLoggedIn, validateReviews, wrapAsync(async(req, res) => {
    let post = await FindrLocation.findById(req.params.id);
    let review = new Review(req.body.review);
    review.author = req.user._id;
    post.reviews.push(review);
    await review.save();
    await post.save();
    req.flash('success', 'Review successfully created !');
    res.redirect(`/locations/${post._id}`);
}));

//export
module.exports = router;