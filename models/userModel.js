const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const savedPaymentMethodSchema = new Schema(
  {
    cardBrand: { type: String, trim: true },
    last4: { type: String, match: /^\d{4}$/ },
    isDefault: { type: Boolean, default: false },
    billingName: { type: String, trim: true },
  },
  { _id: true }
);

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: String,
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phone: String,
    profilePicUrl: String,
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    authProvider: {
      type: String,
      enum: ['LOCAL', 'GOOGLE', 'APPLE', 'FACEBOOK'],
      default: 'LOCAL',
    },
    membershipStatus: {
      type: String,
      enum: ['NONE', 'ACTIVE', 'VIP'],
      default: 'NONE',
    },
    savedPaymentMethods: {
      type: [savedPaymentMethodSchema],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
userSchema.set('toJSON', { virtuals: true });

const User = model('User', userSchema);

module.exports = { User };
