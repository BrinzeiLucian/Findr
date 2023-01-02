//imports
const express = require('express');
let router = express.Router();
const User = require('../models/User');
const wrapAsync = require('../factory/wrapAsync');
const passport = require('passport');

//routes
router.get('/register', (req, res) => {
    res.render('auth/register', { pageName: 'User Registration'});
});

router.post('/register', wrapAsync(async(req, res) => {
    try{
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    await User.register(user, password);
    req.flash('success', 'Registered successfully !');
    res.redirect('/locations');
    } catch(e){
        req.flash("error", `${e.message}.`, "Please try again!");
        res.redirect("/register");
    };
}));

router.get('/login', (req, res) => {
    if(!req.isAuthenticated()){
    res.render('auth/login', { pageName: 'User login'});
    } else {
        req.flash('error', 'You are already signed in !');
        return res.redirect('/locations');
    }
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back !');
    res.redirect('/locations');
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