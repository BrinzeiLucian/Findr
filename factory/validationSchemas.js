//require
const Joi = require('Joi');

//locations validation schema
module.exports.validationLocationsSchemaJOI = Joi.object({
    locations: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required(),
    }).required()
});