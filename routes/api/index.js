const { accessControll } = require('../../middlewares/accessControll');
const { authenticateToken } = require('../../middlewares/authentication');
const { getUserRights } = require('../../middlewares/userRights');
const router = require('express').Router();


// Shows default API routes
router.get('/', (req, res) => {
    res.send("In progress...")
})

router.use('/auth', require('./auth'))

router.use('/', authenticateToken, getUserRights, accessControll, require('./graph'))


module.exports = router