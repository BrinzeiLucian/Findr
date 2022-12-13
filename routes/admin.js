//requires
const express = require('express');
const AppError = require('../factory/AppError');
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