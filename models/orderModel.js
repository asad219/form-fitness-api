const mongoose = require('mongoose');
require('./userModel');
require('./trainingClassModel');
require('./classSessionModel');
require('./productModel');
const { Schema, model } = mongoose;

const paymentDetailsSchema = new Schema(
  {
    method: {
      type: String,
      trim: true,
    },
    billingEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    transactionId: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const bookedClassSchema = new Schema(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'TrainingClass',
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'ClassSession',
    },
    className: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    coachName: {
      type: String,
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
    entryPassToken: {
      type: String,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED', 'ATTENDED'],
      default: 'CONFIRMED',
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  { _id: true }
);

const purchasedProductSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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
      required: true,
    },
    fulfillmentStatus: {
      type: String,
      enum: ['READY_FOR_PICKUP', 'SHIPPED', 'DELIVERED', 'COMPLETED'],
      default: 'READY_FOR_PICKUP',
    },
    pickupLocation: {
      type: String,
      trim: true,
    },
  },
  { _id: true }
);

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'PENDING', 'FAILED', 'REFUNDED'],
      default: 'PAID',
    },
    paymentDetails: {
      type: paymentDetailsSchema,
      default: () => ({}),
    },
    bookedClasses: {
      type: [bookedClassSchema],
      default: [],
    },
    purchasedProducts: {
      type: [purchasedProductSchema],
      default: [],
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPaid: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });

orderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
orderSchema.set('toJSON', { virtuals: true });

const Order = model('Order', orderSchema);

module.exports = { Order, paymentDetailsSchema };
