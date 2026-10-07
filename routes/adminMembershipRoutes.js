const express = require('express');
const { getAllMemberships, getMembershipById } = require('../controllers/membershipController');
const validateToken = require('../middleware/validateTokenHandler');
const requireAdmin = require('../middleware/requireAdmin');
const { validateObjectId } = require('../middleware/validationObjectIdHandler');

const router = express.Router();

// GET /api/v1/admin/memberships?page=1&limit=10&status=ACTIVE&plan=VIP&userId=
router.get('/', validateToken, requireAdmin, getAllMemberships);

// GET /api/v1/admin/memberships/:id
router.get('/:id', validateObjectId, validateToken, requireAdmin, getMembershipById);

module.exports = router;
