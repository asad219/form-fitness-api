/**
 * CMS seed data used by scripts/seedMockData.js.
 * Fixed _ids keep the seeds idempotent (upsert by _id).
 */
const mongoose = require('mongoose');

const oid = (hex) => new mongoose.Types.ObjectId(hex);

const BANNERS = [
  {
    _id: oid('670d4e5f6a7b8c9d0e1f0001'),
    title: 'Train Hard. Recover Harder.',
    subtitle: 'Fall strength block starts Oct 14',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
    placement: 'HOME_HERO',
    ctaText: 'Explore Classes',
    targetRoute: '/train',
    targetParams: {},
    sortOrder: 1,
    isActive: true,
    startDate: null,
    endDate: null,
  },
  {
    _id: oid('670d4e5f6a7b8c9d0e1f0002'),
    title: 'Memberships Are Here',
    subtitle: 'Unlimited group classes, one monthly price',
    imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f',
    placement: 'HOME_HERO',
    ctaText: 'View Plans',
    targetRoute: '/membership',
    targetParams: {},
    sortOrder: 2,
    isActive: true,
    startDate: null,
    endDate: null,
  },
  {
    _id: oid('670d4e5f6a7b8c9d0e1f0003'),
    title: 'New Gear Drop',
    subtitle: 'Heavyweight hoodies + training tees',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
    placement: 'SHOP_PROMO',
    ctaText: 'Shop Now',
    targetRoute: '/shop/products',
    targetParams: { category: 'APPAREL' },
    sortOrder: 1,
    isActive: true,
    startDate: null,
    endDate: null,
  },
  {
    _id: oid('670d4e5f6a7b8c9d0e1f0004'),
    title: 'Book 1-on-1 Coaching',
    subtitle: 'Personalized programming with Coach Maya',
    imageUrl: 'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb',
    placement: 'TRAIN_PROMO',
    ctaText: 'Book a Session',
    targetRoute: '/train/class/670a1b2c3d4e5f6a7b8c0003',
    targetParams: { classId: '670a1b2c3d4e5f6a7b8c0003' },
    sortOrder: 1,
    isActive: true,
    startDate: null,
    endDate: null,
  },
  {
    // Inactive + future window: hidden from /app-config until activated
    _id: oid('670d4e5f6a7b8c9d0e1f0005'),
    title: 'Winter Open House',
    subtitle: 'Free classes all weekend — bring a friend',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
    placement: 'HOME_HERO',
    ctaText: 'RSVP',
    targetRoute: '/train',
    targetParams: { event: 'open-house' },
    sortOrder: 3,
    isActive: false,
    startDate: new Date('2026-12-01T00:00:00.000Z'),
    endDate: new Date('2026-12-15T23:59:59.000Z'),
  },
];

const POPUPS = [
  {
    _id: oid('670e5f6a7b8c9d0e1f2a0001'),
    title: 'Welcome to FORM',
    contentHtml:
      '<p>Book classes, shop gear, and track your training — all in one place. Your first group class is on us.</p>',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
    actionButton: {
      label: 'Browse Classes',
      targetRoute: '/train',
      targetParams: {},
    },
    dismissible: true,
    isActive: true,
    maxDisplayCount: 1,
    startDate: null,
    endDate: null,
  },
  {
    // Inactive on purpose: demonstrates the single-active-popup rule
    _id: oid('670e5f6a7b8c9d0e1f2a0002'),
    title: 'Black Friday Preview',
    contentHtml: '<p>Members get early access to our biggest sale of the year. Stay tuned.</p>',
    imageUrl: null,
    actionButton: {
      label: 'View Deals',
      targetRoute: '/shop/products',
      targetParams: {},
    },
    dismissible: true,
    isActive: false,
    maxDisplayCount: 3,
    startDate: new Date('2026-11-20T00:00:00.000Z'),
    endDate: new Date('2026-11-30T23:59:59.000Z'),
  },
];

const ANNOUNCEMENTS = [
  {
    _id: oid('670f6a7b8c9d0e1f2a3b0001'),
    message: 'Brooklyn club closed Thanksgiving Day',
    level: 'INFO',
    targetRoute: null,
    targetParams: {},
    isActive: true,
    sortOrder: 1,
    startDate: null,
    endDate: null,
  },
  {
    _id: oid('670f6a7b8c9d0e1f2a3b0002'),
    message: '20% off recovery gear this week',
    level: 'PROMO',
    targetRoute: '/shop/products',
    targetParams: { category: 'RECOVERY' },
    isActive: true,
    sortOrder: 2,
    startDate: null,
    endDate: null,
  },
  {
    _id: oid('670f6a7b8c9d0e1f2a3b0003'),
    message: 'Studio 02 maintenance Oct 12 — classes moved to Studio 01',
    level: 'WARNING',
    targetRoute: '/train',
    targetParams: {},
    isActive: true,
    sortOrder: 3,
    startDate: null,
    endDate: new Date('2026-10-13T00:00:00.000Z'),
  },
];

module.exports = { BANNERS, POPUPS, ANNOUNCEMENTS };
