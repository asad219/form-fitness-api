const express = require('express');
const { processCheckout } = require('../controllers/checkoutController');
const { getOrderById } = require('../controllers/orderController');
const validateToken = require('../middleware/validateTokenHandler');
const { validateObjectId } = require('../middleware/validationObjectIdHandler');

const router = express.Router();

// POST /api/v1/checkout/process
router.post('/process', validateToken, processCheckout);

// GET /api/v1/checkout/orders/:id
router.get('/orders/:id', validateObjectId, validateToken, getOrderById);

module.exports = router;
