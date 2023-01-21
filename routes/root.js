//requires
const express = require('express');
let router = express.Router();

//root route 
router.get('/', (req, res) => {
    res.render('home', { pageName: 'Home', CSS: 'default.css' });
});

//export
module.exports = router;