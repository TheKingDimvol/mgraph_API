const { deleteUser, getUsers } = require('../../../controllers/Users/usersController');
const { checkUserInfo, signup } = require('../../../controllers/Users/registration');
const { accessToDeleteUser, accessGetUsers } = require('../../../middlewares/accessControll');
const { getRoles } = require('../../../controllers/Users/userRightsByID');

const router = require('express').Router();


// Получить роли пользователя
router.get('/:uuid/rights', getRoles)

// Просмотр пользователей
router.get('', accessGetUsers, getUsers)

// Регистрация нового пользователя
router.post('/signup', checkUserInfo, signup)

// Выдача прав
router.use('/give-rights', require('./addRights'))

// Удаление пользователя
router.delete('/delete/:uuid', accessToDeleteUser, deleteUser)

// Удаление прав у пользователя
router.use('/remove-rights', require('./removeRights'))


module.exports = router