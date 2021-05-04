const router = require('express').Router();
const typologyController = require('../../../controllers/desks/typologyController')


router.get('/', typologyController.getListOfTypologies)

router.get('/typologyOfDesk', typologyController.getDesksTypology)

router.get('/:id', typologyController.getTypology)

router.post('/', typologyController.createTypology)

router.put('/:id', typologyController.changeTypology)



module.exports = router