const express = require('express');
const router = express.Router();
const users = require('../controllers/users.js');

router.post('/', users.createUser);
router.get('/', users.getUsers);
router.post('/login', users.login);
module.exports = router;