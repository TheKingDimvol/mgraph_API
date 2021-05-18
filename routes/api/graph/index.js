const { workWithGraph, workWithDesks } = require('../../../middlewares/accessControll');

const router = require('express').Router();


const success = (req, res, next) => {
    return next()
    res.send('Success! ' + req.method + ' ' + req.baseUrl)
    return
}


// API routes
router.use('/nodes', workWithGraph, require('./nodes')) // Валидация данных запроса готова

router.use('/types', workWithGraph, require('./types')) // Валидация данных запроса готова

router.use('/desks', workWithDesks, success, require('./desks'))

router.use('/edges', workWithGraph, success, require('./edges')) // Валидация данных запроса готова

router.use('/typologies', workWithDesks, success, require('./typologies'))

router.use('/filters', require('./filters'))


module.exports = router