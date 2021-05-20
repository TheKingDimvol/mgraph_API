const { deleteUser, getUsers } = require('../../../controllers/Users/usersController');
const { checkUserInfo, register } = require('../../../controllers/Users/registration');
const { accessToDeleteUser, accessGetUsers } = require('../../../middlewares/accessControll');
const { getRoles } = require('../../../controllers/Users/userRightsByID');

const router = require('express').Router();


// Получить роли пользователя
router.get('/:uuid/rights', getRoles)

// Просмотр пользователей
router.get('', accessGetUsers, getUsers)

// Регистрация нового пользователя
router.post('/register', checkUserInfo, register)

// Выдача прав
router.use('/give-rights', require('./addRights'))

// Удаление пользователя
router.delete('/delete/:uuid', accessToDeleteUser, deleteUser)

// Удаление прав у пользователя
router.use('/remove-rights', require('./removeRights'))


module.exports = router