if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
};

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const flash = require('connect-flash');
const app = express();
const ejsmate = require('ejs-mate');
const path = require('path');
const { v4: uuid } = require('uuid');
uuid();
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const morgan = require('morgan');
const AppError = require('./factory/AppError');
const reviewsRouter = require('./routes/reviews');
const locationsRouter = require('./routes/locations');
const adminRouter = require('./routes/admin');
const rootRouter = require('./routes/root');
const userRouter = require('./routes/dashboard');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('./models/User');
const authRouter = require('./routes/auth');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const mongoSanitize = require('express-mongo-sanitize');
const sanitizeHtml = require('sanitize-html');
//const helmet = require('helmet');

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

app.use(cookieParser('secret'));
let sessionOptions = {
    name: 'session', 
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:  1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionOptions));

//passport for auth and session persist
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.returnTo = req.originalUrl;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//sanitize
app.use(mongoSanitize());
//app.use(helmet( { contentSecurityPolicy: false } ) );

//route handlers
app.use('/locations/reviews', reviewsRouter);
app.use('/locations', locationsRouter);
app.use('/admin', adminRouter);
app.use(rootRouter);
app.use('/user', userRouter);
app.use('/', authRouter);

//serving static files
app.use(express.static(path.join(__dirname, 'public')));

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
app.all('*', (req, res, next) => {
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