const Joi = require('joi');


const schema = Joi.object({
    query: Joi.object({
        desk: Joi.number()
            .required()
    }).unknown().required()
}).unknown().required()


exports.validateGetNodes = (req, res, next) => {
    const { error } = schema.validate(req)
    if (error) {
        return res.status(400).json({
            error: 'Ошибка в id доски',
            message: error.details[0].message
        })
    }
    next()
}