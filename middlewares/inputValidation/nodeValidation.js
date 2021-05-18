const Joi = require('joi');


const getNodeSchema = Joi.object({
    params: Joi.object({
        id: Joi.number()
            .required()
    }).unknown().required()
}).unknown()

const createNodeSchema = Joi.object({
    body: Joi.object({
        type: Joi.number()
            .required(),
    
        desk: Joi.number()
            .required(),
    
        properties: Joi.object({
            title: Joi.string()
                .required(),
    
            community: Joi.any()
                .forbidden(), 
    
            id: Joi.any()
                .forbidden()
        }).unknown()
    }).unknown().required()
}).unknown()

const changeNodeSchema = Joi.object({
    params: Joi.object({
        id: Joi.number()
            .required()
    }).unknown(),
    
    body: Joi.object({
        desk: Joi.number()
            .required(),    

        properties: Joi.object({
            community: Joi.any()
                .forbidden(), 

            id: Joi.any()
                .forbidden()
        }).unknown().required()
    }).unknown().required()
}).unknown()

const deleteNodeSchema = Joi.object({
    params: Joi.object({
        id: Joi.number()
            .required()
    }),
    body: Joi.object({
        desk: Joi.number()
            .required()
    })
}).unknown()



exports.validateGetNode = (req, res, next) => {
    const { error } = getNodeSchema.validate(req)
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }
    next()
}

exports.validateCreateNode = (req, res, next) => {
    const { error } = createNodeSchema.validate(req)
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }
    next()
}

exports.validateChangeNode = (req, res, next) => {
    const { error } = changeNodeSchema.validate(req)
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }
    next()
}

exports.validateDeleteNode = (req, res, next) => {
    const { error } = deleteNodeSchema.validate(req)
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }
    next()
}