const { confirmUserInput, authenticate } = require('../../../controllers/Users/login');
const router = require('express').Router();


router.post('/', confirmUserInput, authenticate)




module.exports = router