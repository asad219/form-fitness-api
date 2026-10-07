const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const bannerSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: 200,
      default: '',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    placement: {
      type: String,
      enum: ['HOME_HERO', 'SHOP_PROMO', 'TRAIN_PROMO'],
      default: 'HOME_HERO',
      index: true,
    },
    ctaText: {
      type: String,
      trim: true,
      default: 'Explore',
    },
    // Client-side route the CTA navigates to, e.g. '/train/class/123' or '/shop/products'
    targetRoute: {
      type: String,
      required: true,
      trim: true,
    },
    targetParams: {
      type: Schema.Types.Mixed,
      default: {},
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    // Optional display window; null means unbounded
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

bannerSchema.index({ placement: 1, isActive: 1, sortOrder: 1 });

bannerSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
bannerSchema.set('toJSON', { virtuals: true });

const Banner = model('Banner', bannerSchema);

module.exports = { Banner };
