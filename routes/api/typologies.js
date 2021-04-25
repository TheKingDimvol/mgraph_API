const router = require('express').Router();
const typologyController = require('../../controllers/desks/typologyController')


router.get('/', typologyController.getListOfTypologies)

router.get('/:typology', typologyController.get)


module.exports = router