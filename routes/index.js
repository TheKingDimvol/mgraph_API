const { authenticateToken } = require('../middlewares/authentication');
const { getUserRights } = require('../middlewares/userRights');
const router = require('express').Router();


// API with nodes, edges, users and etc.
router.use('/api', authenticateToken, getUserRights, require('./api'))


module.exports = router