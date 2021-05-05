const Joi = require('joi');


const getTypesSchema = Joi.object({
    typology: Joi.number()
        .required()
})

exports.validateGetTypes = (req, res, next) => {
    const { error } = getTypesSchema.validate(req.query)
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }
    next()
}