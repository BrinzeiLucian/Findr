//requires
const express = require('express');
const app = express();
let ejsmate = require('ejs-mate');
const path = require('path');
const { v4: uuid } = require('uuid');
uuid();
const methodOverride = require('method-override');
let mongoose = require('mongoose');
//let FindrLocation = require('./models/dbFindrModel');
let morgan = require('morgan');
//let axios = require('axios');
const AppError = require('./factory/AppError');
//const wrapAsync = require('./factory/wrapAsync');
//const Joi = require('joi');
//let { validationLocationsSchemaJOI } = require('./factory/validationSchemas.js');
//let Review = require('./models/reviewsModel');
let reviewsRouter = require('./routes/reviews');
let locationsRouter = require('./routes/locations');
let adminRouter = require('./routes/admin');
let rootRouter = require('./routes/root');

//set local server PORT
let port = 8080;

//mongoose
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/FindrDB');
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
app.use('/locations/reviews', reviewsRouter);
app.use('/locations', locationsRouter);
app.use('/admin', adminRouter);
app.use(rootRouter);

//serving static files
app.use(express.static(path.join(__dirname, 'customs')));
app.use(express.static(path.join(__dirname, 'factory')));


//ejs setup (instead of require)
app.engine('ejs', ejsmate);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', [__dirname + '/', __dirname + '/views']);

//---------------------------------//

//handle cast error
let handleCastErr = err => {
    return new AppError(`Incorrect id !`, 400);
};

//redirect on incorrect path
app.all('*', (err, req, res, next) => {
    next(new AppError('Page Not found !', 404));
});

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