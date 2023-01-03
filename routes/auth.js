//imports
const express = require('express');
let router = express.Router();
const User = require('../models/User');
const wrapAsync = require('../factory/wrapAsync');
const passport = require('passport');
const { session } = require('passport');
const { checkReturnTo } = require('../factory/middleware');

//routes
router.get('/register', (req, res) => {
    res.render('auth/register', { pageName: 'User Registration'});
});

router.post('/register', wrapAsync(async(req, res, next) => {
    try{
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
    if(err){return next(err);}
    req.flash('success', 'Registered successfully !');
    res.redirect('/locations');        
    });
    } catch(e){
        req.flash("error", `${e.message}.`, "Please try again!");
        res.redirect("/register");
    };
}));

router.get('/login', (req, res) => {
    if(!req.isAuthenticated()){
    res.render('auth/login', { pageName: 'User login'});
    } else {
        req.flash('success', 'Welcome back !');
        return res.redirect('/locations');
    }
});

router.post('/renderLogin', (req, res) => {
    if(req.query.returnTo){
        req.session.returnTo = req.query.returnTo;
    }
});

router.post('/login', checkReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back !');
    const returnToUrl = res.locals.returnTo || '/locations';
    res.redirect(returnToUrl);
});

router.get('/logout', (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in !');
        return res.redirect('/login');
    }
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Logged out successfully !');
      res.redirect('/locations');
    });
});

//export
module.exports = router;