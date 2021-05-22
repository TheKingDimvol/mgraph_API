const { removeAdminRole, removeDeskOwnerRole, removeEditorRole } = require('../../../controllers/Users/rightsController');
const { accessMakeEditor, accessMakeAdmin, accessMakeDeskOwner } = require('../../../middlewares/accessControll');

const router = require('express').Router();


router.post('/admin', accessMakeAdmin, removeAdminRole)

router.post('/desk-creator', accessMakeDeskOwner, removeDeskOwnerRole)

router.post('/editor', accessMakeEditor, removeEditorRole)


module.exports = router