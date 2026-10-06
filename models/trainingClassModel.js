const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const trainingClassSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['GROUP_CLASS', 'PERSONAL_TRAINING', 'COACHING'],
      required: true,
      index: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    level: {
      type: String,
      default: 'All levels',
      trim: true,
    },
    coachName: {
      type: String,
      required: true,
      trim: true,
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
    imageUrl: {
      type: String,
      required: true,
    },
    includedInMembership: {
      type: Boolean,
      default: false,
    },
    cancellationWindowHours: {
      type: Number,
      default: 12,
      min: 0,
    },
  },
  { timestamps: true }
);

trainingClassSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
trainingClassSchema.set('toJSON', { virtuals: true });

const TrainingClass = model('TrainingClass', trainingClassSchema);

module.exports = { TrainingClass };
