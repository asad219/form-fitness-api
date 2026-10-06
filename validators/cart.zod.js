const { z } = require('zod');
const { objectId } = require('./common.zod');

const FULFILLMENT_METHODS = ['CLUB_PICKUP', 'SHIP_TO_ME'];

const cartServiceItemAddSchema = z.object({
  sessionId: objectId,
  attendeesCount: z
    .number()
    .int('Attendees must be a whole number')
    .min(1, 'At least 1 attendee is required')
    .max(10, 'Cannot book more than 10 spots at once')
    .default(1),
});

const cartProductItemAddSchema = z.object({
  productId: objectId,
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(99, 'Quantity cannot exceed 99')
    .default(1),
  selectedColor: z.string().trim().min(1).max(50).optional(),
  selectedSize: z.string().trim().min(1).max(20).optional(),
  fulfillmentMethod: z.enum(FULFILLMENT_METHODS).default('CLUB_PICKUP'),
});

const cartItemUpdateSchema = z
  .object({
    quantity: z
      .number()
      .int('Quantity must be a whole number')
      .min(1, 'Quantity must be at least 1')
      .max(99, 'Quantity cannot exceed 99')
      .optional(),
    fulfillmentMethod: z.enum(FULFILLMENT_METHODS).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, 'At least one field is required');

const parseCartServiceItemAdd = (data) => cartServiceItemAddSchema.parse(data);
const parseCartProductItemAdd = (data) => cartProductItemAddSchema.parse(data);
const parseCartItemUpdate = (data) => cartItemUpdateSchema.parse(data);

module.exports = {
  FULFILLMENT_METHODS,
  cartServiceItemAddSchema,
  cartProductItemAddSchema,
  cartItemUpdateSchema,
  parseCartServiceItemAdd,
  parseCartProductItemAdd,
  parseCartItemUpdate,
};
