const express = require('express');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const contactRoutes = require('./contactRoutes');
const noteRoutes = require('./noteRoutes');
const trainRoutes = require('./trainRoutes');
const shopRoutes = require('./shopRoutes');
const cartRoutes = require('./cartRoutes');
const checkoutRoutes = require('./checkoutRoutes');

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

module.exports = router;
