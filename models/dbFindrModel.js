//imports
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Review = require('./reviewsModel');

//database schema
let dbFindrSchema = new Schema ({
    title: {
        type: String,
        require
        },
    image: {
        type: String,
        require
    },
    location: {
        type: String,
        require
    },
    description: {
        type: String,
        require
    },
    phone: {
        type: String
    },
    website: {
        type: String
    },
    email: {
        type: String
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