const router = require('express').Router();
const nodeController = require('../../../controllers/nodes/nodeController');
const { getNodesByDesk } = require('../../../controllers/nodes/nodesController');
const { validateGetNodes } = require('../../../middlewares/inputValidation/nodesValidation');
const { validateGetNode, validateCreateNode, validateChangeNode, validateDeleteNode } = 
require('../../../middlewares/inputValidation/nodeValidation');


router.get('/', validateGetNodes, getNodesByDesk)

router.post('/', validateCreateNode, nodeController.createNode)

router.get('/:id', validateGetNode, nodeController.getNode)

router.put('/:id', validateChangeNode, nodeController.changeNode)

router.delete('/:id', validateDeleteNode, nodeController.deleteNode)


module.exports = router