const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const validateUser = require('../middleware/expressValidator');


router.post('/signup', validateUser, userCtrl.createUser);
router.post('/login', validateUser, userCtrl.connectUser);

module.exports = router;