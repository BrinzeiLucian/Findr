//imports
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Review = require('./Review');

const ImageSchema = new Schema ({
        url: String,
        filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
   return this.url.replace('/upload', '/upload/w_200');
});

//database schema
let dbFindrSchema = new Schema ({
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String
        },
    images: [ImageSchema],
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
    ],
    tags: [String],
    },
    {
    timestamps: true,
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