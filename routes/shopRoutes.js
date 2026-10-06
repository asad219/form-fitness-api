const express = require('express');
const { getProducts, getProductById } = require('../controllers/shopController');
const { validateObjectId } = require('../middleware/validationObjectIdHandler');

const router = express.Router();

// GET /api/v1/shop/products?category=APPAREL&search=bottle
router.get('/products', getProducts);

// GET /api/v1/shop/products/:id
router.get('/products/:id', validateObjectId, getProductById);

module.exports = router;
