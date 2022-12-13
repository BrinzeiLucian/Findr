//requires
const express = require('express');
const app = express();
//let ejsmate = require('ejs-mate');
//const path = require('path');
//let mongoose = require('mongoose');
//let FindrLocation = require('../models/dbFindrModel');
const AppError = require('../factory/AppError');
//const wrapAsync = require('../factory/wrapAsync');
//const Joi = require('joi');
//const { reviewSchemaJOI } = require('../factory/validationSchemas.js');
//let Review = require('../models/reviewsModel');
let router = express.Router();

//functions
let verifyPassword = (req, res, next) => {
    let { password } = req.query;
    //http://localhost:8080/secret?password=admin
    if(password === 'admin'){
        next();
    };
    throw new AppError('Password required', 401);
};

//routes
router.get('/access', verifyPassword, (req, res) => {
    res.send(`Logged in succesfully`);
});

//export
module.exports = router;