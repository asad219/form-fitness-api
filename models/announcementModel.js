const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const announcementSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 280,
    },
    level: {
      type: String,
      enum: ['INFO', 'WARNING', 'PROMO', 'ALERT'],
      default: 'INFO',
    },
    // Optional deep link when the announcement is tapped
    targetRoute: {
      type: String,
      trim: true,
      default: null,
    },
    targetParams: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
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

announcementSchema.index({ isActive: 1, sortOrder: 1 });

announcementSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
announcementSchema.set('toJSON', { virtuals: true });

const Announcement = model('Announcement', announcementSchema);

module.exports = { Announcement };
