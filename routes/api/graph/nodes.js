const router = require('express').Router();
let nodeController = require('../../../controllers/nodes/nodeController');
const { getNodesByDesk } = require('../../../controllers/nodes/nodesController');


router.get('/', getNodesByDesk)

router.post('/', nodeController.createNode)

router.get('/:id', nodeController.getNode)

router.put('/:id', nodeController.changeNode)

router.delete('/:id', nodeController.deleteNode)


module.exports = router