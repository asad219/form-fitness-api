const mongoose = require('mongoose');
require('./userModel');
const { paymentDetailsSchema } = require('./orderModel');
const { Schema, model } = mongoose;

const membershipSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Plan codes double as the user's membershipStatus while the membership is live
    plan: {
      type: String,
      enum: ['ACTIVE', 'VIP'],
      required: true,
    },
    billingCycle: {
      type: String,
      enum: ['MONTHLY', 'YEARLY'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    // CANCELLED keeps access until endDate; EXPIRED once endDate has passed
    status: {
      type: String,
      enum: ['ACTIVE', 'CANCELLED', 'EXPIRED'],
      default: 'ACTIVE',
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    paymentDetails: {
      type: paymentDetailsSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

membershipSchema.index({ userId: 1, status: 1, endDate: 1 });
membershipSchema.index({ status: 1, endDate: 1 });

membershipSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
membershipSchema.set('toJSON', { virtuals: true });

const Membership = model('Membership', membershipSchema);

module.exports = { Membership };
