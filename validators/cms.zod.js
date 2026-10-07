const { z } = require('zod');
const { paginationSchema } = require('./common.zod');

const BANNER_PLACEMENTS = ['HOME_HERO', 'SHOP_PROMO', 'TRAIN_PROMO'];
const ANNOUNCEMENT_LEVELS = ['INFO', 'WARNING', 'PROMO', 'ALERT'];

const atLeastOneField = (data) => Object.keys(data).length > 0;

const route = z
  .string({ error: 'Target route is required' })
  .trim()
  .min(1, 'Target route is required')
  .max(200);
const params = z.record(z.string(), z.unknown());
const date = z.coerce.date().nullable().optional();

const listQuerySchema = paginationSchema.extend({
  isActive: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  search: z.string().trim().max(80).optional(),
});

// Banners

const bannerFields = {
  title: z.string({ error: 'Title is required' }).trim().min(1, 'Title is required').max(120),
  subtitle: z.string().trim().max(200).optional(),
  imageUrl: z.url('Image URL must be a valid URL'),
  placement: z.enum(BANNER_PLACEMENTS).optional(),
  ctaText: z.string().trim().max(40).optional(),
  targetRoute: route,
  targetParams: params.optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  startDate: date,
  endDate: date,
};

const bannerCreateSchema = z.object(bannerFields);
const bannerUpdateSchema = z
  .object(bannerFields)
  .partial()
  .refine(atLeastOneField, 'At least one field is required');
const bannerListQuerySchema = listQuerySchema.extend({
  placement: z.enum(BANNER_PLACEMENTS).optional(),
});

// Popups

const popupFields = {
  title: z.string({ error: 'Title is required' }).trim().min(1, 'Title is required').max(120),
  contentHtml: z.string({ error: 'Content is required' }).min(1, 'Content is required').max(5000),
  imageUrl: z.url('Image URL must be a valid URL').nullable().optional(),
  actionButton: z
    .object({
      label: z.string().trim().min(1).max(40),
      targetRoute: route,
      targetParams: params.optional(),
    })
    .nullable()
    .optional(),
  dismissible: z.boolean().optional(),
  isActive: z.boolean().optional(),
  maxDisplayCount: z.number().int().min(1).optional(),
  startDate: date,
  endDate: date,
};

const popupCreateSchema = z.object(popupFields);
const popupUpdateSchema = z
  .object(popupFields)
  .partial()
  .refine(atLeastOneField, 'At least one field is required');

// Announcements

const announcementFields = {
  message: z.string({ error: 'Message is required' }).trim().min(1, 'Message is required').max(280),
  level: z.enum(ANNOUNCEMENT_LEVELS).optional(),
  targetRoute: route.nullable().optional(),
  targetParams: params.optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
  startDate: date,
  endDate: date,
};

const announcementCreateSchema = z.object(announcementFields);
const announcementUpdateSchema = z
  .object(announcementFields)
  .partial()
  .refine(atLeastOneField, 'At least one field is required');
const announcementListQuerySchema = listQuerySchema.extend({
  level: z.enum(ANNOUNCEMENT_LEVELS).optional(),
});

const parseBannerCreate = (data) => bannerCreateSchema.parse(data);
const parseBannerUpdate = (data) => bannerUpdateSchema.parse(data);
const parseBannerListQuery = (query) => bannerListQuerySchema.parse(query);
const parsePopupCreate = (data) => popupCreateSchema.parse(data);
const parsePopupUpdate = (data) => popupUpdateSchema.parse(data);
const parsePopupListQuery = (query) => listQuerySchema.parse(query);
const parseAnnouncementCreate = (data) => announcementCreateSchema.parse(data);
const parseAnnouncementUpdate = (data) => announcementUpdateSchema.parse(data);
const parseAnnouncementListQuery = (query) => announcementListQuerySchema.parse(query);

module.exports = {
  BANNER_PLACEMENTS,
  ANNOUNCEMENT_LEVELS,
  parseBannerCreate,
  parseBannerUpdate,
  parseBannerListQuery,
  parsePopupCreate,
  parsePopupUpdate,
  parsePopupListQuery,
  parseAnnouncementCreate,
  parseAnnouncementUpdate,
  parseAnnouncementListQuery,
};
