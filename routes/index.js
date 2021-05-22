const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');
const { authenticateToken } = require('../middlewares/authentication');
const { getUserRights } = require('../middlewares/userRights');
const router = require('express').Router();


// Работа с БД
router.use('/api', authenticateToken, getUserRights, require('./api'))

// Документация АПИ
router.use('/api-docs', swaggerUi.serve)
router.get('/api-docs', swaggerUi.setup(swaggerDocument))


module.exports = router