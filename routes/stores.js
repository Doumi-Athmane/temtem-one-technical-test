const express = require('express');
const router = express.Router();
const stores = require('../controllers/stores.js');


router.post('/', stores.createStore);

module.exports = router;