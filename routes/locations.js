//requires
const express = require('express');
const app = express();
let FindrLocation = require('../models/dbFindrModel');
const AppError = require('../factory/AppError');
const wrapAsync = require('../factory/wrapAsync');
const { validationLocationsSchemaJOI } = require('../factory/validationSchemas.js');
let router = express.Router({mergeParams: true});

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
router.delete('/:id/delete', wrapAsync (async ( req, res, next ) => {
    let { id } = req.params;
    await FindrLocation.findByIdAndDelete(id);
    res.redirect('/locations');
}));

//update location
router.put('/:id', validateLocations, wrapAsync (async (req, res, next) => {
    let { id } = req.params;
    let updateData = await FindrLocation.findByIdAndUpdate(id, { ...req.body.locations }, { runValidators: true, new: true } );
    res.redirect(`/locations/${updateData._id}`);
}));

//edit locations
router.get('/edit/:id', wrapAsync (async (req, res, next) => {
    let updateData = await FindrLocation.findById(req.params.id)
        if(!updateData){
            throw new AppError('Location not found !', 404);
        };
    res.render('locations/edit', { pageName: `Edit`, updateData });
}));

//new location
router.get('/new', (req, res) => {
    res.render('locations/new', {pageName: 'New Location'});
});

router.post('/', validateLocations, wrapAsync (async (req, res, next) => {
    let newLocation = FindrLocation(req.body.locations);
    await newLocation.save();
    res.redirect(`locations/${newLocation._id}`);
}));

//location id
router.get('/:id', wrapAsync (async (req, res, next) => {
    let data = await FindrLocation.findById(req.params.id).populate('reviews');
    console.log(data);
        if(!data){throw new AppError('Location not found !', 404);};
    res.render('locations/show', { pageName: `Location page`, data });
}));

//all locations
router.get('/', wrapAsync (async (req, res, next) => {
        let Findr = await FindrLocation.find({});
        res.render('locations/index', { pageName: 'Findr Locations', Findr });
}));

//export
module.exports = router;