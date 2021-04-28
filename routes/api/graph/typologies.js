const router = require('express').Router();
const typologyController = require('../../../controllers/desks/typologyController')


router.get('/', typologyController.getListOfTypologies)

router.get('/typologyOfDesk', typologyController.getDesksTypology)

router.get('/:id', typologyController.get)

router.post('/', typologyController.post)

router.put('/:id', typologyController.put)



module.exports = router