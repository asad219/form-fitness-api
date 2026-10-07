const express = require('express');
const { getProducts, getProductById } = require('../controllers/shopController');
const { validateObjectId } = require('../middleware/validationObjectIdHandler');

const router = express.Router();

// GET /api/v1/shop/products?page=1&limit=10&category=APPAREL&search=bottle
router.get('/products', getProducts);

// GET /api/v1/shop/products/:id
router.get('/products/:id', validateObjectId, getProductById);

module.exports = router;
