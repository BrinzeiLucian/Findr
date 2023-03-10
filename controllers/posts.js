//imports
const express = require('express');
const app = express();
const FindrLocation = require('../models/dbFindrModel');
const AppError = require('../factory/AppError');
const wrapAsync = require('../factory/wrapAsync');
const router = express.Router({mergeParams: true});
const { isLoggedIn, validateLocations } = require('../factory/middleware');
const { cloudinary } = require('../cloudinary');

//controllers
module.exports.index = async (req, res, next) => {
    let Findr = await FindrLocation.find({});
    res.render('locations/index', { pageName: 'Posts', Findr });
};

module.exports.Id = async (req, res) => {
    let data = await FindrLocation.findById(req.params.id)
    .populate({path: 'reviews', populate:{path:'author'}})
    .populate('author');
    //if(!data){throw new AppError('Location not found !', 404);};
    if(!data){
        req.flash('error', 'Post id not found !');
        return res.redirect(`/locations`);
    };
    res.render('locations/show', { pageName: `Posts`, data });
};

module.exports.renderNewForm = (req, res) => {
    res.render('locations/new', {pageName: 'New Post'});
};

module.exports.createNewPost = async (req, res, next) => {
    let newLocation = FindrLocation(req.body.locations);
    newLocation.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    newLocation.author = req.user._id;
    await newLocation.save();
    req.flash('success', 'Successfully created post !');
    res.redirect(`locations/${newLocation._id}`);
};

module.exports.renderEditForm = async (req, res, next) => {
    let { id } = req.params;
    let updateData = await FindrLocation.findById(id);
    //if(!updateData){throw new AppError('Location not found !', 404);};
    if(!updateData){
        req.flash('error', 'Post id not found !');
        return res.redirect(`/locations`);
    };
    if(!updateData.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission !');
        return res.redirect(`/locations/${id}`);
    };
    res.render('locations/edit', { pageName: `Edit`, updateData, CSS: 'global.css' });
};

module.exports.updatePost = async (req, res, next) => {
    const { id } = req.params;
    const updateData = await FindrLocation.findById(id);
    if(!updateData.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission !');
        return res.redirect(`/locations/${id}`);
    } else {
    const updateCheckedData = await FindrLocation.findByIdAndUpdate(id, { ...req.body.locations }, { runValidators: true, new: true } );
    const images = req.files.map(f => ({url: f.path, filename: f.filename}));
    updateCheckedData.images.push(...images);
    await updateCheckedData.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
           await cloudinary.uploader.destroy(filename);
        };
        await updateCheckedData.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}});
    };
    req.flash('success', 'Successfully edited post !');
    res.redirect(`/locations/${updateData._id}`);
}};

module.exports.deletePost = async ( req, res, next ) => {
    let { id } = req.params;
    const deleteData = await FindrLocation.findById(id);
    if(!deleteData.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission !');
        return res.redirect(`/locations/${id}`);
    } else {
    await FindrLocation.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted post !');
    res.redirect('/locations');
}};