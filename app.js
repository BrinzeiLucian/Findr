
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
app.use(express.static(path.join(__dirname, 'utils')));

//ejs setup (instead of require)
app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

//---------------------------------//

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

/*
//admin route
app.get('/admin', (req, res, next)=>{
    throw new AppError('Not an admin !', 403);
});
*/

//delete location
app.delete('/locations/:id', wrapAsync (async ( req, res, next ) => {
    let { id } = req.params;
    await FindrLocation.findByIdAndDelete(id);
    res.redirect('/locations');
}));

//update location
app.put('/locations/:id', wrapAsync (async (req, res, next) => {
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

app.post('/locations', wrapAsync (async (req, res, next) => {
    if(!req.body.locations){
        throw new AppError('invalid data !', 400);
    };
    let newLocation = FindrLocation(req.body.locations);
    await newLocation.save();
    res.redirect(`locations/${newLocation._id}`);
}));

//location id
app.get('/locations/:id', wrapAsync (async (req, res, next) => {
    let data = await FindrLocation.findById(req.params.id);
        if(!data){
            throw new AppError('Location not found !', 404);
        };
    res.render('locations/show', {pageName: `Location page`, data});
}));

//all locations
app.get('/locations', wrapAsync (async (req, res, next) => {
        let Findr = await FindrLocation.find({});
        res.render('locations/index', {pageName: 'Findr Locations', Findr});
}));

//home
app.get('/', (req, res) => {
    res.render('home', {pageName: 'Findr'});
})

//---------------------------------//
/*
//error
app.get('/error', (req, res) => {
    res.render('error', {pageName: 'Not Found !'});
});
*/

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