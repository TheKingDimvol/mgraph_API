const { addAdminRole, addDeskOwnerRole, addEditorRole } = require('../../../controllers/Users/rightsController');
const { accessMakeEditor, accessMakeAdmin, accessMakeDeskOwner } = require('../../../middlewares/accessControll');
const { editorExists } = require('../../../middlewares/existsCheck');

const router = require('express').Router();


router.post('/admin', accessMakeAdmin, addAdminRole)

router.post('/desk-creator', accessMakeDeskOwner, addDeskOwnerRole)

router.post('/editor', accessMakeEditor, editorExists, addEditorRole)


module.exports = router