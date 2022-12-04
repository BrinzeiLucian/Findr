let mongoose = require('mongoose');
//const { default: mongoose } = require('mongoose');
let Schema = mongoose.Schema;

let reviewSchema = new Schema({
    comment: {
        type: String,
        require
    },
    rating:{
        type: Number,
        min: '1',
        max: '5',
        require
    }
});

module.exports = mongoose.model('Review', reviewSchema);