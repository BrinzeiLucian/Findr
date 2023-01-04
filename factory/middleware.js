//imports
const AppError = require('../factory/AppError');
const { validationLocationsSchemaJOI, reviewSchemaJOI } = require('../factory/validationSchemas.js');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in !');
        return res.redirect('/login');
    }
    next();
};

module.exports.checkReturnTo = (req, res, next) => {
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

 module.exports.validateLocations = (req, res, next) => {    
    let { error } = validationLocationsSchemaJOI.validate(req.body);
    if(error){
        let msg = error.details.map(el => el.message).join(`,`);
        throw new AppError(msg, 400);
    } else{
        next();
    };
};

 module.exports.validateReviews = (req, res, next) => {
    let { error } = reviewSchemaJOI.validate(req.body);
    if(error){
        let msg = error.details.map(el => el.message).join(`,`);
        throw new AppError(msg, 400);
    } else{
        next();
    };
};