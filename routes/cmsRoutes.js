const express = require('express');
const {
  getAppConfig,
  getActiveBanners,
  getActiveAnnouncements,
  getActivePopup,
} = require('../controllers/cmsController');

const router = express.Router();

// GET /api/v1/app-config
router.get('/app-config', getAppConfig);

// GET /api/v1/banners
router.get('/banners', getActiveBanners);

// GET /api/v1/announcements
router.get('/announcements', getActiveAnnouncements);

// GET /api/v1/popups/active
router.get('/popups/active', getActivePopup);

module.exports = router;
