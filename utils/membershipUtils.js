const { Membership } = require('../models/membershipModel');
const { User } = require('../models/userModel');

// Plan catalogue; codes match Membership.plan and User.membershipStatus
const MEMBERSHIP_PLANS = [
  {
    code: 'ACTIVE',
    name: 'FORM Active',
    description: 'Unlimited group classes, one monthly price.',
    prices: { MONTHLY: 99, YEARLY: 990 },
    perks: ['Unlimited classes marked as included in membership', 'Member pricing on events'],
  },
  {
    code: 'VIP',
    name: 'FORM VIP',
    description: 'Everything in Active plus priority access.',
    prices: { MONTHLY: 179, YEARLY: 1790 },
    perks: [
      'Everything in FORM Active',
      'Priority booking for popular classes',
      'Monthly recovery session',
    ],
  },
];

const BILLING_CYCLE_MONTHS = { MONTHLY: 1, YEARLY: 12 };

// Statuses that still grant access until endDate
const LIVE_STATUSES = ['ACTIVE', 'CANCELLED'];

const findPlan = (code) => MEMBERSHIP_PLANS.find((plan) => plan.code === code);

const liveMembershipFilter = (userId, now = new Date()) => ({
  userId,
  status: { $in: LIVE_STATUSES },
  endDate: { $gt: now },
});

/**
 * Mark memberships whose endDate has passed as EXPIRED and reset the owners' membershipStatus.
 * Runs lazily before membership reads since there is no scheduler.
 *
 * @param {object} [filter] extra Membership filter, e.g. { userId }
 */
const expireLapsedMemberships = async (filter = {}) => {
  const lapsed = await Membership.find({
    ...filter,
    status: { $in: LIVE_STATUSES },
    endDate: { $lte: new Date() },
  })
    .select('_id userId')
    .lean();
  if (lapsed.length === 0) return;

  await Membership.updateMany(
    { _id: { $in: lapsed.map((membership) => membership._id) } },
    { $set: { status: 'EXPIRED' } }
  );

  // Skip users who already started a new membership
  const userIds = [...new Set(lapsed.map((membership) => membership.userId.toString()))];
  const stillLive = await Membership.distinct('userId', {
    userId: { $in: userIds },
    status: { $in: LIVE_STATUSES },
    endDate: { $gt: new Date() },
  });
  const stillLiveIds = new Set(stillLive.map((id) => id.toString()));
  const toReset = userIds.filter((id) => !stillLiveIds.has(id));

  if (toReset.length > 0) {
    await User.updateMany({ _id: { $in: toReset } }, { $set: { membershipStatus: 'NONE' } });
  }
};

module.exports = {
  MEMBERSHIP_PLANS,
  BILLING_CYCLE_MONTHS,
  LIVE_STATUSES,
  findPlan,
  liveMembershipFilter,
  expireLapsedMemberships,
};
