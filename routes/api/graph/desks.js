const router = require('express').Router();
const desksController = require('../../../controllers/desks/desksController');
const { getNodes, getEdges, getTypology } = require('../../../controllers/desks/getDesksData');


router.get('/', desksController.getListOfDesks)

router.get('/:id', desksController.getAllDeskData)

router.get('/:id/properties/nodes', getNodes)

router.get('/:id/properties/edges', getEdges)

router.get('/:id/properties/typology', getTypology)

router.post('/', desksController.createDesk)

router.put('/:id' , desksController.changeDesk)

router.delete('/:id', desksController.deleteDesk)


module.exports = router