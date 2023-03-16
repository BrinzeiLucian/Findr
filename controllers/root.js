//imports
const express = require('express');
const FindrLocation = require('../models/dbFindrModel');
const Review = require('../models/Review');
const User = require('../models/User');

module.exports.root = async(req, res) => {
    let posts = await FindrLocation.countDocuments();
    let reviews = await Review.countDocuments();
    let users = await User.countDocuments();
    res.render('home', { pageName: 'Home', posts, reviews, users });
};