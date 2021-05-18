const Joi = require('joi');


const getTypeSchema = Joi.object({
    params: Joi.object({
        id: Joi.number()
            .required()
    }).unknown()
}).unknown()

const createTypeSchema = Joi.object({
    body: Joi.object({
        desk: Joi.number()
            .required(),
    
        properties: Joi.object({
            title: Joi.string()
                .required()
                .invalid('User', 'Desk Owner', 'Admin', 'Super'),
    
            community: Joi.number()
                .required(),
    
            id: Joi.any()
                .forbidden()
        }).unknown()
    }).unknown().required()
}).unknown()

const changeTypeSchema = Joi.object({
    params: Joi.object({
        id: Joi.number()
            .required()
    }),
    
    body: Joi.object({
        desk: Joi.number()
            .required(),    

        properties: Joi.object({
            title: Joi.string()
                .optional()
                .invalid('User', 'Desk Owner', 'Admin', 'Super'),

            community: Joi.any()
                .forbidden(), 

            id: Joi.any()
                .forbidden()
        }).unknown().required()
    })
}).unknown()

const deleteTypeSchema = Joi.object({
    params: Joi.object({
        id: Joi.number()
            .required()
    }),
    body: Joi.object({
        desk: Joi.number()
            .required()
    })
}).unknown()



exports.validateGetType = (req, res, next) => {
    const { error } = getTypeSchema.validate(req)
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }
    next()
}

exports.validateCreateType = (req, res, next) => {
    const { error } = createTypeSchema.validate(req)
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }
    if (roles.includes(req.body.properties.title)) {
        return res.status(400).json({ error: 'Запрещённое имя типа' })
    }

    next()
}

exports.validateChangeType = (req, res, next) => {
    const { error } = changeTypeSchema.validate(req)
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }
    if (roles.includes(req.body.properties.title)) {
        return res.status(400).json({ error: 'Запрещённое имя типа' })
    }
    
    next()
}

exports.validateDeleteType = (req, res, next) => {
    const { error } = deleteTypeSchema.validate(req)
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }
    next()
}