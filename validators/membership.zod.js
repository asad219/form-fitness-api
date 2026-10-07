const { z } = require('zod');
const { objectId, paginationSchema } = require('./common.zod');
const { paymentDetailsSchema } = require('./checkout.zod');

const MEMBERSHIP_PLAN_CODES = ['ACTIVE', 'VIP'];
const BILLING_CYCLES = ['MONTHLY', 'YEARLY'];
const MEMBERSHIP_STATUSES = ['ACTIVE', 'CANCELLED', 'EXPIRED'];

const membershipSubscribeSchema = z.object({
  plan: z.enum(MEMBERSHIP_PLAN_CODES, { error: 'Plan must be ACTIVE or VIP' }),
  billingCycle: z.enum(BILLING_CYCLES).default('MONTHLY'),
  paymentDetails: paymentDetailsSchema.optional(),
});

const adminMembershipListQuerySchema = paginationSchema.extend({
  status: z.enum(MEMBERSHIP_STATUSES).optional(),
  plan: z.enum(MEMBERSHIP_PLAN_CODES).optional(),
  userId: objectId.optional(),
});

const parseMembershipSubscribe = (data) => membershipSubscribeSchema.parse(data ?? {});
const parseAdminMembershipListQuery = (query) => adminMembershipListQuerySchema.parse(query);

module.exports = {
  MEMBERSHIP_PLAN_CODES,
  BILLING_CYCLES,
  MEMBERSHIP_STATUSES,
  parseMembershipSubscribe,
  parseAdminMembershipListQuery,
};
