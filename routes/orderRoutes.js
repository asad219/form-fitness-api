const express = require('express');
const { getMyOrders, getOrderById, cancelBooking } = require('../controllers/orderController');
const validateToken = require('../middleware/validateTokenHandler');
const { validateObjectId } = require('../middleware/validationObjectIdHandler');

const router = express.Router();

// GET /api/v1/orders?page=1&limit=10&paymentStatus=PAID
router.get('/', validateToken, getMyOrders);

// GET /api/v1/orders/:id (owner or admin)
router.get('/:id', validateObjectId, validateToken, getOrderById);

// POST /api/v1/orders/:id/bookings/:bookingId/cancel (owner or admin, outside the cancellation window)
router.post('/:id/bookings/:bookingId/cancel', validateObjectId, validateToken, cancelBooking);

module.exports = router;
