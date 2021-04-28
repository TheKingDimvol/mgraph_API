const router = require('express').Router();


// API routes
router.use('/nodes', require('./nodes'))

router.use('/types', require('./types'))

router.use('/desks', require('./desks'))

router.use('/edges', require('./edges'))

router.use('/typologies', require('./typologies'))


module.exports = router