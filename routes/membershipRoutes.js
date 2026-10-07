const express = require('express');
const {
  getMembershipPlans,
  getMyMembership,
  subscribeMembership,
  cancelMyMembership,
} = require('../controllers/membershipController');
const validateToken = require('../middleware/validateTokenHandler');

const router = express.Router();

// GET /api/v1/memberships/plans
router.get('/plans', getMembershipPlans);

// GET /api/v1/memberships/me
router.get('/me', validateToken, getMyMembership);

// POST /api/v1/memberships/subscribe
router.post('/subscribe', validateToken, subscribeMembership);

// POST /api/v1/memberships/me/cancel (access continues until endDate)
router.post('/me/cancel', validateToken, cancelMyMembership);

module.exports = router;
