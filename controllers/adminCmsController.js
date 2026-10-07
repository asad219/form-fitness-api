const asyncHandler = require('express-async-handler');
const { Banner } = require('../models/bannerModel');
const { Popup } = require('../models/popupModel');
const { Announcement } = require('../models/announcementModel');
const {
  parseBannerCreate,
  parseBannerUpdate,
  parseBannerListQuery,
  parsePopupCreate,
  parsePopupUpdate,
  parsePopupListQuery,
  parseAnnouncementCreate,
  parseAnnouncementUpdate,
  parseAnnouncementListQuery,
} = require('../validators/cms.zod');

// Escape user input before embedding it in a RegExp
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const listItems = async (Model, query, searchField) => {
  const { page, limit, search, ...filters } = query;
  const filter = { ...filters };
  if (search) {
    filter[searchField] = new RegExp(escapeRegExp(search), 'i');
  }

  const [items, total] = await Promise.all([
    Model.find(filter)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Model.countDocuments(filter),
  ]);

  return {
    items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

const findItem = async (Model, label, req, res) => {
  const item = await Model.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error(`${label} not found`);
  }

  return item;
};

// Only one popup may be live at a time
const deactivateOtherPopups = (popupId) =>
  Popup.updateMany({ _id: { $ne: popupId }, isActive: true }, { $set: { isActive: false } });

// Banners

const getBanners = asyncHandler(async (req, res) => {
  const { items, pagination } = await listItems(Banner, parseBannerListQuery(req.query), 'title');

  res.status(200).json({ success: true, banners: items, pagination });
});

const getBannerById = asyncHandler(async (req, res) => {
  const banner = await findItem(Banner, 'Banner', req, res);

  res.status(200).json({ success: true, banner });
});

const createBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.create(parseBannerCreate(req.body));

  res.status(201).json({ success: true, message: 'Banner created successfully', banner });
});

const updateBanner = asyncHandler(async (req, res) => {
  const data = parseBannerUpdate(req.body);
  const banner = await findItem(Banner, 'Banner', req, res);

  Object.assign(banner, data);
  await banner.save();

  res.status(200).json({ success: true, message: 'Banner updated successfully', banner });
});

const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await findItem(Banner, 'Banner', req, res);
  await banner.deleteOne();

  res.status(200).json({ success: true, message: 'Banner deleted successfully' });
});

// Popups

const getPopups = asyncHandler(async (req, res) => {
  const { items, pagination } = await listItems(Popup, parsePopupListQuery(req.query), 'title');

  res.status(200).json({ success: true, popups: items, pagination });
});

const getPopupById = asyncHandler(async (req, res) => {
  const popup = await findItem(Popup, 'Popup', req, res);

  res.status(200).json({ success: true, popup });
});

const createPopup = asyncHandler(async (req, res) => {
  const popup = await Popup.create(parsePopupCreate(req.body));
  if (popup.isActive) {
    await deactivateOtherPopups(popup._id);
  }

  res.status(201).json({ success: true, message: 'Popup created successfully', popup });
});

const updatePopup = asyncHandler(async (req, res) => {
  const data = parsePopupUpdate(req.body);
  const popup = await findItem(Popup, 'Popup', req, res);

  Object.assign(popup, data);
  await popup.save();
  if (data.isActive) {
    await deactivateOtherPopups(popup._id);
  }

  res.status(200).json({ success: true, message: 'Popup updated successfully', popup });
});

const deletePopup = asyncHandler(async (req, res) => {
  const popup = await findItem(Popup, 'Popup', req, res);
  await popup.deleteOne();

  res.status(200).json({ success: true, message: 'Popup deleted successfully' });
});

// Announcements

const getAnnouncements = asyncHandler(async (req, res) => {
  const { items, pagination } = await listItems(
    Announcement,
    parseAnnouncementListQuery(req.query),
    'message'
  );

  res.status(200).json({ success: true, announcements: items, pagination });
});

const getAnnouncementById = asyncHandler(async (req, res) => {
  const announcement = await findItem(Announcement, 'Announcement', req, res);

  res.status(200).json({ success: true, announcement });
});

const createAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.create(parseAnnouncementCreate(req.body));

  res
    .status(201)
    .json({ success: true, message: 'Announcement created successfully', announcement });
});

const updateAnnouncement = asyncHandler(async (req, res) => {
  const data = parseAnnouncementUpdate(req.body);
  const announcement = await findItem(Announcement, 'Announcement', req, res);

  Object.assign(announcement, data);
  await announcement.save();

  res
    .status(200)
    .json({ success: true, message: 'Announcement updated successfully', announcement });
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await findItem(Announcement, 'Announcement', req, res);
  await announcement.deleteOne();

  res.status(200).json({ success: true, message: 'Announcement deleted successfully' });
});

module.exports = {
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
};
