const { authenticate } = require('../../../controllers/Users/login');
const { confirmUserInput } = require('../../../middlewares/confirmUserInput');
const router = require('express').Router();


router.post('/', confirmUserInput, authenticate)




module.exports = router