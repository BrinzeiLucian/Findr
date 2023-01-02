//imports
const express = require('express');
let router = express.Router();
const User = require('../models/User');

//routes
router.get('/register', (req, res) => {
    res.render('auth/register', { pageName: 'User Registration'});
});

router.get('/login', (req, res) => {
    res.render('auth/login', { pageName: 'User login'});
});

//export
module.exports = router;