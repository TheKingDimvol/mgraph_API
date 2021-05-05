const router = require('express').Router();
const typeController = require('../../../controllers/nodes/typeController');
const { getTypesOfTypology } = require('../../../controllers/nodes/typesController');
const { validateGetTypes } = require('../../../middlewares/inputValidation/typesValidation');
const { validateGetType, validateCreateType, validateDeleteType } = require('../../../middlewares/inputValidation/typeValidation');


router.get('/', validateGetTypes, getTypesOfTypology)

router.post('/', validateCreateType, typeController.createType)

router.get('/:id', validateGetType, typeController.getType)

router.put('/:id', validateCreateType, typeController.changeType)

router.delete('/:id', validateDeleteType, typeController.deleteType)


module.exports = router