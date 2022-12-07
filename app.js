
/** NPM required installs
 * npm init -y (for package json)
 * npm i express (install express)
 * npm i nodemon (for server restart -> local install) OR npm install -g nodemon (global install)
 * npm install axios
 * npm i ejs (install ejs for templating)
 * npm install --save-dev webpack (install webpack local)
 * npm install uuid
 * npm i method-override
 * npm i mongoose
 * npm install morgan
 * npm install ejs-mate --save
 * npm i joi
 */

//requires
const express = require('express');
const app = express();
let ejsmate = require('ejs-mate');
const path = require('path');
const { v4: uuid } = require('uuid');
uuid();
const methodOverride = require('method-override');
let mongoose = require('mongoose');
let FindrLocation = require('./models/dbFindrModel');
let morgan = require('morgan');
let axios = require('axios');
const AppError = require('./factory/AppError');
const wrapAsync = require('./factory/wrapAsync');
const Joi = require('joi');
const { validationLocationsSchemaJOI, reviewSchemaJOI } = require('./factory/validationSchemas.js');
let Review = require('./models/reviewsModel');

//set local server PORT
let port = 8080;

//mongoose
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/FindrDB');
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
};

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){
    console.log('Mongo connected...');
});

//app uses
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('tiny'));

//serving static files
app.use(express.static(path.join(__dirname, 'customs')));

//ejs setup (instead of require)
app.engine('ejs', ejsmate);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', [__dirname + '/', __dirname + '/views']);

//---------------------------------//

let validateLocations = (req, res, next) => {    
    let { error } = validationLocationsSchemaJOI.validate(req.body);
    if(error){
        let msg = error.details.map(el => el.message).join(`,`);
        throw new AppError(msg, 400);
    } else{
        next();
    };
};

let validateReviews = (req, res, next) => {
    let { error } = reviewSchemaJOI.validate(req.body);
    if(error){
        let msg = error.details.map(el => el.message).join(`,`);
        throw new AppError(msg, 400);
    } else{
        next();
    };
}

//auth function
let verifyPassword = (req, res, next) => {
    let { password } = req.query;
    //http://localhost:8080/secret?password=Password
    if(password === 'Password'){
        next();
    };
    throw new AppError('Password required', 401);
};

//secret route with auth
app.get('/secret', verifyPassword, (req, res) => {
    //console.log(`Logged in succesfully`);
    res.send(`Logged in succesfully`);
});

//delete location
app.delete('/locations/:id', wrapAsync (async ( req, res, next ) => {
    let { id } = req.params;
    await FindrLocation.findByIdAndDelete(id);
    res.redirect('/locations');
}));

//update location
app.put('/locations/:id', validateLocations, wrapAsync (async (req, res, next) => {
    let { id } = req.params;
    let updateData = await FindrLocation.findByIdAndUpdate(id, { ...req.body.locations }, { runValidators: true, new: true } );
    res.redirect(`/locations/${updateData._id}`);
}));

//edit locations
app.get('/locations/edit/:id', wrapAsync (async (req, res, next) => {
    let updateData = await FindrLocation.findById(req.params.id)
        if(!updateData){
            throw new AppError('Location not found !', 404);
        };
    res.render('locations/edit', { pageName: `Edit`, updateData });
}));

//new location
app.get('/locations/new', (req, res) => {
    res.render('locations/new', {pageName: 'New Location'});
});

app.post('/locations', validateLocations, wrapAsync (async (req, res, next) => {
    let newLocation = FindrLocation(req.body.locations);
    await newLocation.save();
    res.redirect(`locations/${newLocation._id}`);
}));

//location id
app.get('/locations/:id', wrapAsync (async (req, res, next) => {
    let data = await FindrLocation.findById(req.params.id).populate('reviews');
    console.log(data);
        if(!data){throw new AppError('Location not found !', 404);};
    res.render('locations/show', { pageName: `Location page`, data });
}));

//reviews
app.post('/locations/reviews/:id', validateReviews, wrapAsync(async(req, res) => {
    let post = await FindrLocation.findById(req.params.id);
    let review = new Review(req.body.review);
    post.reviews.push(review);
    await review.save();
    await post.save();
    console.log(req.body.review);
    res.redirect(`/locations/${post._id}`);
}));

//all locations
app.get('/locations', wrapAsync (async (req, res, next) => {
        let Findr = await FindrLocation.find({});
        res.render('locations/index', { pageName: 'Findr Locations', Findr });
}));

//root homepage
app.get('/', (req, res) => {
    res.render('home', { pageName: 'Home'});
});

//---------------------------------//

//redirect on incorrect path
app.all('*', (req, res, next) => {
    next(new AppError('Page Not found !', 404));
});

//handle cast error
let handleCastErr = err => {
    return new AppError(`Incorrect id !`, 400);
};

app.use((err, req, res, next) => {
    if(err.name === 'CastError') err = handleCastErr(err);
    next(err);
});

//custom default error handler 
app.use((err, req, res, next) => {
    let { statusCode = 500 } = err;
    if(!err.message){
        err.message = 'Error';
    };
    res.status(err.status || statusCode).render('error', { err, pageName: 'Error' });
});

//port setup
try{
app.listen(`${port}`, () => {
    console.log(`Listening on port: ${port}`);
})} catch(err){
    res.send(`Something went wrong on server connection to PORT: ${port}!`);
    console.log(err);
};