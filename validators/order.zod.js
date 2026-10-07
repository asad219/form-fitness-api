const { z } = require('zod');
const { objectId, paginationSchema } = require('./common.zod');

const PAYMENT_STATUSES = ['PAID', 'PENDING', 'FAILED', 'REFUNDED'];

const myOrderListQuerySchema = paginationSchema.extend({
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
});

const dateOnly = (label) =>
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, `${label} must be in YYYY-MM-DD format`);

const adminOrderListQuerySchema = myOrderListQuerySchema.extend({
  userId: objectId.optional(),
  orderNumber: z.string().trim().toUpperCase().max(20).optional(),
  from: dateOnly('from').optional(),
  to: dateOnly('to').optional(),
});

const parseMyOrderListQuery = (query) => myOrderListQuerySchema.parse(query);
const parseAdminOrderListQuery = (query) => adminOrderListQuerySchema.parse(query);

module.exports = {
  PAYMENT_STATUSES,
  parseMyOrderListQuery,
  parseAdminOrderListQuery,
};
