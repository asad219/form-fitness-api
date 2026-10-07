const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const actionButtonSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    targetRoute: {
      type: String,
      required: true,
      trim: true,
    },
    targetParams: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }
);

const popupSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    // Rendered as HTML by the client
    contentHtml: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    actionButton: {
      type: actionButtonSchema,
      default: null,
    },
    dismissible: {
      type: Boolean,
      default: true,
    },
    // Only one popup should be live at a time; the admin controller enforces exclusivity
    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },
    // How many times a single client may see this popup
    maxDisplayCount: {
      type: Number,
      default: 1,
      min: 1,
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

popupSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
popupSchema.set('toJSON', { virtuals: true });

const Popup = model('Popup', popupSchema);

module.exports = { Popup };
