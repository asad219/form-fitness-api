const mongoose = require('mongoose');
require('./trainingClassModel');
const { Schema, model } = mongoose;

const classSessionSchema = new Schema(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'TrainingClass',
      required: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
    },
    totalSpots: {
      type: Number,
      required: true,
      min: 1,
    },
    bookedSpots: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['OPEN', 'FULL', 'CANCELLED'],
      default: 'OPEN',
    },
  },
  { timestamps: true }
);

classSessionSchema.index({ classId: 1, date: 1 });

classSessionSchema.virtual('availableSpots').get(function () {
  return this.totalSpots - this.bookedSpots;
});
classSessionSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
classSessionSchema.set('toJSON', { virtuals: true });

const ClassSession = model('ClassSession', classSessionSchema);

module.exports = { ClassSession };
