const Joi = require('joi');

const validationSchema = Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    images:Joi.array().items(
        Joi.object({
            path: Joi.string().required(),
            filename: Joi.string().required()
        })),
    price: Joi.number().required().min(0),
    description: Joi.string(),
    deleteImage: Joi.array()
    });

module.exports = validationSchema;