const { removeAdminRole, removeDeskCreatorRole, removeEditorRole } = require('../../../controllers/Users/rightsController');
const { accessMakeEditor, accessMakeAdmin, accessMakeDeskCreator } = require('../../../middlewares/accessControll');

const router = require('express').Router();


router.post('/admin', accessMakeAdmin, removeAdminRole)

router.post('/desk-creator', accessMakeDeskCreator, removeDeskCreatorRole)

router.post('/editor', accessMakeEditor, removeEditorRole)


module.exports = router