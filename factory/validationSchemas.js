//require
const baseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

//html sanitization
const sanitization = (Joi) => ({
  type: "string",
  base: Joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML !",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) {
          return helpers.error("string.escapeHTML", { value });
        } else {
          return clean;
        }
      },
    },
  },
});

const Joi = baseJoi.extend(sanitization);

//locations validation schema
module.exports.validationLocationsSchemaJOI = Joi.object({
  locations: Joi.object({
    title: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    //images: Joi.string().required().escapeHTML(),
    phone: Joi.string().required().escapeHTML(),
    website: Joi.string().required().escapeHTML(),
    email: Joi.string().required().escapeHTML(),
    tags: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
}).options({ allowUnknown: true });

module.exports.reviewSchemaJOI = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required().escapeHTML(),
  }).required(),
});
