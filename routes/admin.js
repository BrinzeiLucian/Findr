//requires
const express = require('express');
const AppError = require('../factory/AppError');
let router = express.Router();

/*
//functions
let verifyPassword = (req, res, next) => {
    let { admin } = req.query;
    //http://localhost:8080/secret?admin=true
    if(admin === 'true'){
        next();
    };
    throw new AppError('Access denied !', 401);
};
*/

//middleware
router.use((req, res, next) => {
    let { admin } = req.query;
    if(admin === 'true'){
        next();
    };
    throw new AppError('Access denied !', 401);
});

//routes
router.get('/access', (req, res) => {
    res.send(`Logged in succesfully`);
});

//export
module.exports = router;