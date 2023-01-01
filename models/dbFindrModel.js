//imports
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Review = require('./reviewsModel');

//database schema
let dbFindrSchema = new Schema ({
    title: {
        type: String,
        required: true
        },
    image: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

//delete post reviews middleware
dbFindrSchema.post('findOneAndDelete', async function(data) {
    if(data){
        await Review.deleteMany({
            _id: {
                $in: data.reviews
            }
        })
    };
});

module.exports = mongoose.model('FindrLocation', dbFindrSchema);