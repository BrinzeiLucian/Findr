//requires
const express = require('express');
let router = express.Router();

//root route 
router.get('/', (req, res) => {
    res.render('home', { pageName: 'Home' });
});

//export
module.exports = router;