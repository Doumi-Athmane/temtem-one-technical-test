const express = require('express');
const router = express.Router();
const products = require('../controllers/products.js');


router.get('/', products.getProducts);
router.post('/', products.createProduct);
router.get('/:id', products.getProduct);
router.patch('/:id', products.updateProduct);
router.delete('/:id', products.deleteProduct);
module.exports = router;