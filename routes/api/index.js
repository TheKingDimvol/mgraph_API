const router = require('express').Router();


// Shows default API routes
router.get('/', (req, res) => {
    res.send("In progress...")
})

router.use('/users', require('./users'))

router.use('/auth', require('./auth'))

router.use('/', require('./graph'))


module.exports = router