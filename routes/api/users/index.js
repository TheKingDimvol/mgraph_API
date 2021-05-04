const { deleteUser, getUsers } = require('../../../controllers/Users/usersController');
const { checkUserInfo, register } = require('../../../controllers/Users/registration');
const { accessToDeleteUser, accessGetUsers } = require('../../../middlewares/accessControll');
const { authenticateToken } = require('../../../middlewares/authentication');
const { getUserRights } = require('../../../middlewares/userRights');

const router = require('express').Router();


// Просмотр пользователей
router.get('', authenticateToken, getUserRights, accessGetUsers, getUsers)

// Регистрация нового пользователя
router.post('/register', checkUserInfo, register)

// Выдача прав
router.use('/give-rights', authenticateToken, getUserRights, require('./addRights'))

// Удаление пользователя
router.delete('/delete/:uuid', authenticateToken, getUserRights, accessToDeleteUser, deleteUser)

// Удаление прав у пользователя
router.use('/remove-rights', authenticateToken, getUserRights, require('./removeRights'))


module.exports = router