const express = require('express');
const { getAllOrders, getOrderByIdForAdmin } = require('../controllers/orderController');
const validateToken = require('../middleware/validateTokenHandler');
const requireAdmin = require('../middleware/requireAdmin');
const { validateObjectId } = require('../middleware/validationObjectIdHandler');

const router = express.Router();

// GET /api/v1/admin/orders?page=1&limit=10&paymentStatus=PAID&userId=&orderNumber=FRM-12345&from=2026-10-01&to=2026-10-31
router.get('/', validateToken, requireAdmin, getAllOrders);

// GET /api/v1/admin/orders/:id
router.get('/:id', validateObjectId, validateToken, requireAdmin, getOrderByIdForAdmin);

module.exports = router;
