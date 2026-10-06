const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const productOptionsSchema = new Schema(
  {
    colors: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: [],
    },
    volume: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['APPAREL', 'EQUIPMENT', 'RECOVERY'],
      required: true,
      index: true,
    },
    badge: {
      type: String,
      enum: ['BESTSELLER', 'NEW', 'TRAINING', 'NONE'],
      default: 'NONE',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: {
      type: [String],
      required: true,
    },
    options: {
      type: productOptionsSchema,
      default: () => ({}),
    },
    features: {
      type: [String],
      default: [],
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    isPickupAvailable: {
      type: Boolean,
      default: true,
    },
    pickupLocation: {
      type: String,
      default: 'Brooklyn club front desk',
      trim: true,
    },
  },
  { timestamps: true }
);

productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
productSchema.set('toJSON', { virtuals: true });

const Product = model('Product', productSchema);

module.exports = { Product };
