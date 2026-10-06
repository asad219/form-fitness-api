const express = require('express');
const {
  getCart,
  addServiceItem,
  addProductItem,
  updateCartItem,
  removeCartItem,
} = require('../controllers/cartController');
const validateToken = require('../middleware/validateTokenHandler');
const { validateObjectId } = require('../middleware/validationObjectIdHandler');

const router = express.Router();

// GET /api/v1/cart
router.get('/', validateToken, getCart);

// POST /api/v1/cart/service-items
router.post('/service-items', validateToken, addServiceItem);

// POST /api/v1/cart/product-items
router.post('/product-items', validateToken, addProductItem);

// PATCH /api/v1/cart/items/:itemId
router.patch('/items/:itemId', validateObjectId, validateToken, updateCartItem);

// DELETE /api/v1/cart/items/:itemId
router.delete('/items/:itemId', validateObjectId, validateToken, removeCartItem);

module.exports = router;
