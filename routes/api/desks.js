const router = require('express').Router();
const desksController = require('../../controllers/desks/desksController')


router.get('/', desksController.getListOfDesks)

router.get('/:desk', desksController.get)


module.exports = router