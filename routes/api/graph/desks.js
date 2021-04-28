const router = require('express').Router();
const desksController = require('../../../controllers/desks/desksController')


router.get('/', desksController.getListOfDesks)

router.get('/:id', desksController.get)

router.post('/', desksController.post)

router.put('/:id' , desksController.put)


module.exports = router