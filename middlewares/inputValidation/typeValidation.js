const Joi = require('joi');


const getTypeSchema = Joi.object({
    id: Joi.number()
        .required()
})

const createTypeSchema = Joi.object({
    desk: Joi.number()
        .required(),

    properties: Joi.object({
        title: Joi.string()
            .required(),

        community: Joi.number()
            .required(),

        id: Joi.any()
            .forbidden()
    }).unknown()
})

const changeTypeSchema = Joi.object({
    params: Joi.object({
        id: Joi.number()
            .required()
    }),
    
    body: Joi.object({
        desk: Joi.number()
            .required(),    

        properties: Joi.object({
            community: Joi.any()
                .forbidden(), 

            id: Joi.any()
                .forbidden()
        }).unknown().required()
    })
})

const deleteTypeSchema = Joi.object({
    params: Joi.object({
        id: Joi.number()
            .required()
    }),
    body: Joi.object({
        desk: Joi.number()
            .required()
    })
}).unknown().required()



exports.validateGetType = (req, res, next) => {
    const { error } = getTypeSchema.validate(req.params)
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }
    next()
}

exports.validateCreateType = (req, res, next) => {
    const { error } = createTypeSchema.validate(req.body)
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