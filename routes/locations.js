//requires
const express = require('express');
const app = express();
const FindrLocation = require('../models/dbFindrModel');
const AppError = require('../factory/AppError');
const wrapAsync = require('../factory/wrapAsync');
const { validationLocationsSchemaJOI } = require('../factory/validationSchemas.js');
const router = express.Router({mergeParams: true});
const { isLoggedIn } = require('../factory/middleware');

//functions
let validateLocations = (req, res, next) => {    
    let { error } = validationLocationsSchemaJOI.validate(req.body);
    if(error){
        let msg = error.details.map(el => el.message).join(`,`);
        throw new AppError(msg, 400);
    } else{
        next();
    };
};

//routes
//delete location
router.delete('/:id/delete', isLoggedIn, wrapAsync (async ( req, res, next ) => {
    let { id } = req.params;
    const deleteData = await FindrLocation.findById(id);
    if(!deleteData.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission !');
        return res.redirect(`/locations/${id}`);
    } else {
    await FindrLocation.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted post !');
    res.redirect('/locations');
}}));

//update location
router.put('/:id', isLoggedIn, validateLocations, wrapAsync (async (req, res, next) => {
    const { id } = req.params;
    const updateData = await FindrLocation.findById(id);
    if(!updateData.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission !');
        return res.redirect(`/locations/${id}`);
    } else {
    const updateCheckedData = await FindrLocation.findByIdAndUpdate(id, { ...req.body.locations }, { runValidators: true, new: true } );
    req.flash('success', 'Successfully edited post !');
    res.redirect(`/locations/${updateData._id}`);
}}));

//edit locations
router.get('/edit/:id', isLoggedIn, wrapAsync (async (req, res, next) => {
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
    res.render('locations/edit', { pageName: `Edit`, updateData });
}));

//new location
router.get('/new', isLoggedIn, (req, res) => {
    res.render('locations/new', {pageName: 'New Post'});
});

router.post('/', validateLocations, isLoggedIn, wrapAsync (async (req, res, next) => {
    let newLocation = FindrLocation(req.body.locations);
    newLocation.author = req.user._id;
    await newLocation.save();
    req.flash('success', 'Successfully created post !');
    res.redirect(`locations/${newLocation._id}`);
}));

//location id
router.get('/:id', wrapAsync (async (req, res) => {
    let data = await FindrLocation.findById(req.params.id).populate('reviews').populate('author');
    //if(!data){throw new AppError('Location not found !', 404);};
    if(!data){
        req.flash('error', 'Post id not found !');
        return res.redirect(`/locations`);
    };
    res.render('locations/show', { pageName: `Posts`, data });
}));

//all locations
router.get('/', wrapAsync (async (req, res, next) => {
        let Findr = await FindrLocation.find({});
        res.render('locations/index', { pageName: 'Posts', Findr });
}));

//export
module.exports = router;