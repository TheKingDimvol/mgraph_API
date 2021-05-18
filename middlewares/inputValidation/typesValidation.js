const Joi = require('joi');


const getTypesSchema = Joi.object({
    query: Joi.object({
        typology: Joi.number()
            .required()
    }).unknown()
}).unknown()

exports.validateGetTypes = (req, res, next) => {
    const { error } = getTypesSchema.validate(req)
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }
    next()
}