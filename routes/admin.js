//requires
const express = require('express');
const app = express();
let router = express.Router();
const AppError = require('../factory/AppError');

//middleware
router.use((req, res, next) => {
    let { admin } = req.query;
    if(admin === 'true'){
        next();
    };
    throw new AppError('Access denied !', 401);
});

//cookies
router.get('/setcookies',(req, res) => {
    res.cookie('user', 'TestUser');
    res.cookie('password', 'TestPassword');
    res.send('Sent cookies');
});

router.get('/getcookies', (req, res) => {
    let { user = 'default'} = req.cookies;
    let { password = 'default'} = req.cookies;
    res.send(`${user} <br> ${password}`);
});

router.get('/setsignedcookies', (req, res) => {
    res.cookie('admin', 'admin', {signed: true});
    res.cookie('adminPassword', 'adminPassword', {signed: true});
    res.send(`signed cookies`);
});

router.get('/getsignedcookies', (req, res) => {
    let { admin = 'invalid'} = req.signedCookies;
    let { adminPassword = 'invalid'} = req.signedCookies;
    res.send(`${admin} <br> ${adminPassword}`);
});

router.get('/viewcount', (req, res) => {
    let { username } = req.session;
    if(req.session.count){
        req.session.count += 1;
    } else {
        req.session.count = 1;
    };
    res.send(`${username} you visited the page ${req.session.count} times`);
});

//export
module.exports = router;