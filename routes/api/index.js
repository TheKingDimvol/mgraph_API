const router = require('express').Router();


// Shows default API routes
router.get('/', (req, res) => {
    res.send("In progress...")
})


// API routes
router.use('/nodes', require('./nodes'))

router.use('/types', require('./types'))

router.use('/desks', require('./desks'))

router.use('/edges', require('./edges'))

router.use('/typologies', require('./typologies'))

/*
router.use('/users', require('./users'))
*/

module.exports = router