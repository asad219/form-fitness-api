const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const { Membership } = require('../models/membershipModel');
const { User } = require('../models/userModel');
const {
  parseMembershipSubscribe,
  parseAdminMembershipListQuery,
} = require('../validators/membership.zod');
const {
  MEMBERSHIP_PLANS,
  BILLING_CYCLE_MONTHS,
  findPlan,
  liveMembershipFilter,
  expireLapsedMemberships,
} = require('../utils/membershipUtils');
const { addMonthsUtc } = require('../utils/dateTimeUtils');
const { resolvePaymentDetails } = require('../utils/paymentUtils');

const MEMBERSHIP_USER_FIELDS = '_id email firstName lastName phone membershipStatus';

// Users

const getMembershipPlans = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, plans: MEMBERSHIP_PLANS });
});

const getMyMembership = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  await expireLapsedMemberships({ userId });

  const [membership, history] = await Promise.all([
    Membership.findOne(liveMembershipFilter(userId)).sort({ endDate: -1 }).lean(),
    Membership.find({ userId }).sort({ createdAt: -1 }).lean(),
  ]);

  res.status(200).json({ success: true, membership, history });
});

const subscribeMembership = asyncHandler(async (req, res) => {
  const { plan: planCode, billingCycle, paymentDetails } = parseMembershipSubscribe(req.body);
  const userId = req.user.userId;
  const plan = findPlan(planCode);

  await expireLapsedMemberships({ userId });

  const dbSession = await mongoose.startSession();
  let membership;

  try {
    // Writing the user inside the transaction makes concurrent subscribes conflict and retry
    await dbSession.withTransaction(async () => {
      const existing = await Membership.findOne(liveMembershipFilter(userId)).session(dbSession);
      if (existing) {
        res.status(409);
        throw new Error(
          `You already have a ${existing.plan} membership until ${existing.endDate.toISOString().slice(0, 10)}`
        );
      }

      const user = await User.findById(userId).session(dbSession);
      if (!user) {
        res.status(404);
        throw new Error('User not found');
      }

      const startDate = new Date();
      [membership] = await Membership.create(
        [
          {
            userId,
            plan: plan.code,
            billingCycle,
            price: plan.prices[billingCycle],
            status: 'ACTIVE',
            startDate,
            endDate: addMonthsUtc(startDate, BILLING_CYCLE_MONTHS[billingCycle]),
            paymentDetails: resolvePaymentDetails(paymentDetails, user),
          },
        ],
        { session: dbSession }
      );

      // updateOne always bumps updatedAt, so this write happens even if the status is unchanged
      await User.updateOne(
        { _id: userId },
        { $set: { membershipStatus: plan.code } },
        { session: dbSession }
      );
    });
  } finally {
    await dbSession.endSession();
  }

  res.status(201).json({
    success: true,
    message: 'Membership activated successfully',
    membership,
  });
});

const cancelMyMembership = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  await expireLapsedMemberships({ userId });

  const membership = await Membership.findOne(liveMembershipFilter(userId)).sort({ endDate: -1 });
  if (!membership) {
    res.status(404);
    throw new Error('You do not have an active membership');
  }
  if (membership.status === 'CANCELLED') {
    res.status(400);
    throw new Error('Your membership is already cancelled');
  }

  // Access continues until endDate; expiry resets the user's membershipStatus
  membership.status = 'CANCELLED';
  membership.cancelledAt = new Date();
  await membership.save();

  res.status(200).json({
    success: true,
    message: `Membership cancelled. You keep access until ${membership.endDate.toISOString().slice(0, 10)}`,
    membership,
  });
});

// Admin

const getAllMemberships = asyncHandler(async (req, res) => {
  const { status, plan, userId, page, limit } = parseAdminMembershipListQuery(req.query);
  await expireLapsedMemberships();

  const filter = {};
  if (status) filter.status = status;
  if (plan) filter.plan = plan;
  if (userId) filter.userId = userId;

  const [memberships, total] = await Promise.all([
    Membership.find(filter)
      .populate('userId', MEMBERSHIP_USER_FIELDS)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Membership.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    memberships,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

const getMembershipById = asyncHandler(async (req, res) => {
  const existing = await Membership.findById(req.params.id).select('userId').lean();
  if (!existing) {
    res.status(404);
    throw new Error('Membership not found');
  }
  await expireLapsedMemberships({ userId: existing.userId });

  const membership = await Membership.findById(req.params.id).populate(
    'userId',
    MEMBERSHIP_USER_FIELDS
  );

  res.status(200).json({ success: true, membership });
});

module.exports = {
  getMembershipPlans,
  getMyMembership,
  subscribeMembership,
  cancelMyMembership,
  getAllMemberships,
  getMembershipById,
};
