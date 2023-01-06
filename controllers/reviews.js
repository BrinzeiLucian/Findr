//imports
const express = require('express');
let FindrLocation = require('../models/dbFindrModel');
const AppError = require('../factory/AppError');
const wrapAsync = require('../factory/wrapAsync');
let Review = require('../models/Review');
let router = express.Router({mergeParams: true});
const { isLoggedIn, validateReviews, checkReturnTo } = require('../factory/middleware');

//controllers
//create new review
module.exports.createReview = async(req, res) => {
    let post = await FindrLocation.findById(req.params.id);
    let review = new Review(req.body.review);
    review.author = req.user._id;
    post.reviews.push(review);
    await review.save();
    await post.save();
    req.flash('success', 'Review successfully created !');
    res.redirect(`/locations/${post._id}`);
};

//delete review
module.exports.deleteReview = async(req, res) => {
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
};

//edit review form
module.exports.renderReviewEditForm = async (req, res, next) => {
    let idData = await FindrLocation.findById(req.params.id);
    let reviewData = await Review.findById(req.params.reviewId).populate('author');
        if(!reviewData){
            throw new AppError('Location not found !', 404);
        };
    res.render('reviews/edit', { pageName: `Edit Reviews`, idData, reviewData });
};

//edit review
module.exports.editReview = async(req, res) => {
    try{
    let { id, reviewId } = req.params;
    const reviewData = await Review.findById(reviewId);
    await Review.findByIdAndUpdate(reviewId, { ...req.body.review });
    req.flash('success', 'Review successfully edited !');
    res.redirect(`/locations/${id}`);
} catch(err) {
    res.send(err);
}};