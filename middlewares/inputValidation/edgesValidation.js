const Joi = require('joi');


const getAllEdgesSchema = Joi.object({
    query: Joi.object({
        desk: Joi.number()
            .required()
    }).unknown()
}).unknown()

const createEdgeSchema = Joi.object({
    body: Joi.object({
        start: Joi.number()
            .required(),
    
        end: Joi.number()
            .required(),
    
        properties: Joi.object({
            type: Joi.string()
                .required()
        }).unknown().required()
    }).unknown()
}).unknown()

const deleteEdgeSchema = Joi.object({
    body: Joi.object({
        start: Joi.number()
            .required(),
    
        end: Joi.number()
            .required()
    }).unknown()
}).unknown()


exports.validateGetAllEdges = (req, res, next) => {
    const { error } = getAllEdgesSchema.validate(req)
    if (error) {
        return res.status(400).json({
            error: 'Ошибка в id доски',
            message: error.details[0].message
        })
    }
    next()
}

exports.validateCreateEdge = (req, res, next) => {
    const { error } = createEdgeSchema.validate(req)
    if (error) {
        return res.status(400).json({
            error: 'Ошибка в добавлении вершины',
            message: error.details[0].message
        })
    }
    next()
}

exports.validateDeleteEdge = (req, res, next) => {
    const { error } = deleteEdgeSchema.validate(req)
    if (error) {
        return res.status(400).json({
            error: 'Ошибка в удалении вершины',
            message: error.details[0].message
        })
    }
    next()
}