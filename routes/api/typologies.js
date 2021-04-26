const router = require('express').Router();
const typologyController = require('../../controllers/desks/typologyController')


router.get('/', typologyController.getListOfTypologies)

router.get('/typologyOfDesk', typologyController.getDesksTypology)

router.get('/:typology', typologyController.get)

router.post('/', typologyController.post)



module.exports = router