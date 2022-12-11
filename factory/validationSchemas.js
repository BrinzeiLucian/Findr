//require
const Joi = require('Joi');

//locations validation schema
module.exports.validationLocationsSchemaJOI = Joi.object({
    locations: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required(),
        phone: Joi.string().required(),
        website: Joi.string().required(),
        email: Joi.string().required(),
    }).required()
});

module.exports.reviewSchemaJOI = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});