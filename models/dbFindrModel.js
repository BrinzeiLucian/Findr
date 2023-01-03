//imports
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Review = require('./Review');

//database schema
let dbFindrSchema = new Schema ({
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String
        },
    image: {
        type: String
    },
    location: {
        type: String
    },
    description: {
        type: String
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