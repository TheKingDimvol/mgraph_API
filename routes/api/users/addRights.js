const { addAdminRole, addDeskCreatorRole, addEditorRole } = require('../../../controllers/Users/rightsController');
const { accessMakeEditor, accessMakeAdmin, accessMakeDeskCreator } = require('../../../middlewares/accessControll');
const { editorExists } = require('../../../middlewares/existsCheck');

const router = require('express').Router();


router.post('/admin', accessMakeAdmin, addAdminRole)

router.post('/desk-creator',accessMakeDeskCreator, addDeskCreatorRole)

router.post('/editor', accessMakeEditor, editorExists, addEditorRole)


module.exports = router