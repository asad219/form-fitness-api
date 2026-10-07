const asyncHandler = require('express-async-handler');
const { Banner } = require('../models/bannerModel');
const { Popup } = require('../models/popupModel');
const { Announcement } = require('../models/announcementModel');

// Active records inside their optional startDate/endDate display window
const activeFilter = () => {
  const now = new Date();
  return {
    isActive: true,
    $and: [
      { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: null }, { endDate: { $gte: now } }] },
    ],
  };
};

const getAppConfig = asyncHandler(async (req, res) => {
  const filter = activeFilter();

  const [heroBanners, promoBanners, announcements, popup] = await Promise.all([
    Banner.find({ ...filter, placement: 'HOME_HERO' })
      .sort({ sortOrder: 1 })
      .lean(),
    Banner.find({ ...filter, placement: { $in: ['SHOP_PROMO', 'TRAIN_PROMO'] } })
      .sort({ placement: 1, sortOrder: 1 })
      .lean(),
    Announcement.find(filter).sort({ sortOrder: 1, createdAt: -1 }).lean(),
    Popup.findOne(filter).sort({ updatedAt: -1 }).lean(),
  ]);

  res.status(200).json({
    success: true,
    heroBanners,
    promoBanners,
    announcements,
    popup,
  });
});

const getActiveBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find(activeFilter()).sort({ sortOrder: 1, createdAt: -1 }).lean();

  res.status(200).json({
    success: true,
    banners,
  });
});

const getActiveAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find(activeFilter())
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    announcements,
  });
});

const getActivePopup = asyncHandler(async (req, res) => {
  const popup = await Popup.findOne(activeFilter()).sort({ updatedAt: -1 }).lean();

  res.status(200).json({
    success: true,
    popup,
  });
});

module.exports = {
  getAppConfig,
  getActiveBanners,
  getActiveAnnouncements,
  getActivePopup,
};
