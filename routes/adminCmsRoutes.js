const express = require('express');
const {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  getPopups,
  getPopupById,
  createPopup,
  updatePopup,
  deletePopup,
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/adminCmsController');
const validateToken = require('../middleware/validateTokenHandler');
const requireAdmin = require('../middleware/requireAdmin');
const { validateObjectId } = require('../middleware/validationObjectIdHandler');

const router = express.Router();

// GET /api/v1/admin/cms/banners?page=1&limit=10&placement=HOME_HERO&isActive=true&search=
router.get('/banners', validateToken, requireAdmin, getBanners);

// POST /api/v1/admin/cms/banners
router.post('/banners', validateToken, requireAdmin, createBanner);

// GET /api/v1/admin/cms/banners/:id
router.get('/banners/:id', validateObjectId, validateToken, requireAdmin, getBannerById);

// PATCH /api/v1/admin/cms/banners/:id
router.patch('/banners/:id', validateObjectId, validateToken, requireAdmin, updateBanner);

// DELETE /api/v1/admin/cms/banners/:id
router.delete('/banners/:id', validateObjectId, validateToken, requireAdmin, deleteBanner);

// GET /api/v1/admin/cms/popups?page=1&limit=10&isActive=true&search=
router.get('/popups', validateToken, requireAdmin, getPopups);

// POST /api/v1/admin/cms/popups (activating a popup deactivates the others)
router.post('/popups', validateToken, requireAdmin, createPopup);

// GET /api/v1/admin/cms/popups/:id
router.get('/popups/:id', validateObjectId, validateToken, requireAdmin, getPopupById);

// PATCH /api/v1/admin/cms/popups/:id
router.patch('/popups/:id', validateObjectId, validateToken, requireAdmin, updatePopup);

// DELETE /api/v1/admin/cms/popups/:id
router.delete('/popups/:id', validateObjectId, validateToken, requireAdmin, deletePopup);

// GET /api/v1/admin/cms/announcements?page=1&limit=10&level=INFO&isActive=true&search=
router.get('/announcements', validateToken, requireAdmin, getAnnouncements);

// POST /api/v1/admin/cms/announcements
router.post('/announcements', validateToken, requireAdmin, createAnnouncement);

// GET /api/v1/admin/cms/announcements/:id
router.get(
  '/announcements/:id',
  validateObjectId,
  validateToken,
  requireAdmin,
  getAnnouncementById
);

// PATCH /api/v1/admin/cms/announcements/:id
router.patch(
  '/announcements/:id',
  validateObjectId,
  validateToken,
  requireAdmin,
  updateAnnouncement
);

// DELETE /api/v1/admin/cms/announcements/:id
router.delete(
  '/announcements/:id',
  validateObjectId,
  validateToken,
  requireAdmin,
  deleteAnnouncement
);

module.exports = router;
