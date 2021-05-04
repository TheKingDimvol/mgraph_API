const { workWithGraph, workWithDesks } = require('../../../middlewares/accessControll');

const router = require('express').Router();


const success = (req, res, next) => {
    res.send('Success! ' + req.method + ' ' + req.baseUrl)
    return
}


// API routes
router.use('/nodes', workWithGraph, success, require('./nodes'))

router.use('/types', workWithGraph, success, require('./types'))

router.use('/desks', workWithDesks, success, require('./desks'))

router.use('/edges', workWithGraph, success, require('./edges'))

router.use('/typologies', workWithDesks, success, require('./typologies'))

router.use('/filters', require('./filters'))


module.exports = router