const express = require('express');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const contactRoutes = require('./contactRoutes');
const noteRoutes = require('./noteRoutes');
const trainRoutes = require('./trainRoutes');
const shopRoutes = require('./shopRoutes');
const cartRoutes = require('./cartRoutes');
const checkoutRoutes = require('./checkoutRoutes');
const cmsRoutes = require('./cmsRoutes');
const adminCmsRoutes = require('./adminCmsRoutes');
const orderRoutes = require('./orderRoutes');
const membershipRoutes = require('./membershipRoutes');
const adminOrderRoutes = require('./adminOrderRoutes');
const adminMembershipRoutes = require('./adminMembershipRoutes');

const router = express.Router();

// Mount user routes
router.use('/users', userRoutes);

// Mount auth routes
router.use('/auth', authRoutes);

// Mount contact routes
router.use('/contact', contactRoutes);

// Mount note routes
router.use('/notes', noteRoutes);

// Mount train routes
router.use('/train', trainRoutes);

// Mount shop routes
router.use('/shop', shopRoutes);

// Mount cart routes
router.use('/cart', cartRoutes);

// Mount checkout routes
router.use('/checkout', checkoutRoutes);

// Mount public CMS routes (/app-config, /banners, /announcements, /popups/active)
router.use('/', cmsRoutes);

// Mount admin CMS routes
router.use('/admin/cms', adminCmsRoutes);

// Mount order routes
router.use('/orders', orderRoutes);

// Mount membership routes
router.use('/memberships', membershipRoutes);

// Mount admin order routes
router.use('/admin/orders', adminOrderRoutes);

// Mount admin membership routes
router.use('/admin/memberships', adminMembershipRoutes);

module.exports = router;
