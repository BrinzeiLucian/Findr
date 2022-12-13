//requires
const express = require('express');
let FindrLocation = require('../models/dbFindrModel');
const AppError = require('../factory/AppError');
const wrapAsync = require('../factory/wrapAsync');
const { reviewSchemaJOI } = require('../factory/validationSchemas.js');
let Review = require('../models/reviewsModel');
let router = express.Router();

//functions
let validateReviews = (req, res, next) => {
    let { error } = reviewSchemaJOI.validate(req.body);
    if(error){
        let msg = error.details.map(el => el.message).join(`,`);
        throw new AppError(msg, 400);
    } else{
        next();
    };
};

//routes
//reviews delete
router.delete('/:id/:reviewId/delete', wrapAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await FindrLocation.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/locations/${id}`);
}));

//reviews
router.post('/:id', validateReviews, wrapAsync(async(req, res) => {
    let post = await FindrLocation.findById(req.params.id);
    let review = new Review(req.body.review);
    post.reviews.push(review);
    await review.save();
    await post.save();
    console.log(req.body.review);
    res.redirect(`/locations/${post._id}`);
}));

//export
module.exports = router;