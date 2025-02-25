const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const validateUser = require('../middleware/expressValidator');
const loginLimit = require('../middleware/loginLimit');


router.post('/signup', validateUser, userCtrl.createUser);
router.post('/login', loginLimit, validateUser, userCtrl.connectUser);

module.exports = router;