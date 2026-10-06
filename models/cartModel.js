const mongoose = require('mongoose');
require('./userModel');
require('./classSessionModel');
require('./productModel');
const { computeCartTotals } = require('../utils/pricingUtils');
const { Schema, model } = mongoose;

const cartServiceItemSchema = new Schema(
  {
    sessionRef: {
      type: Schema.Types.ObjectId,
      ref: 'ClassSession',
      required: true,
    },
    attendeesCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: true }
);

const cartProductItemSchema = new Schema(
  {
    productRef: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    selectedColor: {
      type: String,
      trim: true,
    },
    selectedSize: {
      type: String,
      trim: true,
    },
    fulfillmentMethod: {
      type: String,
      enum: ['CLUB_PICKUP', 'SHIP_TO_ME'],
      default: 'CLUB_PICKUP',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: true }
);

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    serviceItems: {
      type: [cartServiceItemSchema],
      default: [],
    },
    productItems: {
      type: [cartProductItemSchema],
      default: [],
    },
    appliedPromoCode: {
      type: String,
      default: null,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    estimatedTax: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Recompute money fields from the item arrays on every save
cartSchema.pre('save', function () {
  const { subtotal, deliveryFee, estimatedTax, total } = computeCartTotals(this);
  this.subtotal = subtotal;
  this.deliveryFee = deliveryFee;
  this.estimatedTax = estimatedTax;
  this.total = total;
});

cartSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
cartSchema.set('toJSON', { virtuals: true });

const Cart = model('Cart', cartSchema);

module.exports = { Cart };
