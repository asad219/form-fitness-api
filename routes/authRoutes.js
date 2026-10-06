const express = require('express');
const { firebaseLogin, refreshAccessToken } = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimitHandler');

const router = express.Router();

// POST /api/v1/auth/firebase-login
router.post('/firebase-login', authLimiter, firebaseLogin);

// POST /api/v1/auth/refresh
router.post('/refresh', authLimiter, refreshAccessToken);

module.exports = router;
