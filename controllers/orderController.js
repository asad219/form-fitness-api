const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const { Order } = require('../models/orderModel');
const { ClassSession } = require('../models/classSessionModel');
const { TrainingClass } = require('../models/trainingClassModel');
const { parseMyOrderListQuery, parseAdminOrderListQuery } = require('../validators/order.zod');
const { convertDateOnlyToDate, zonedDateTimeToUtc } = require('../utils/dateTimeUtils');
const config = require('../config');

const DEFAULT_CANCELLATION_WINDOW_HOURS = 12;
const ORDER_USER_FIELDS = '_id email firstName lastName phone membershipStatus';

const paginateOrders = async (filter, { page, limit }, populateUser = false) => {
  let query = Order.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  if (populateUser) {
    query = query.populate('userId', ORDER_USER_FIELDS);
  }

  const [orders, total] = await Promise.all([query.lean(), Order.countDocuments(filter)]);

  return { orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

const assertCanAccessOrder = (order, req, res) => {
  if (req.user.role !== 'admin' && order.userId.toString() !== String(req.user.userId)) {
    res.status(403);
    throw new Error('Access denied: You do not have permission to access this resource');
  }
};

// Users

const getMyOrders = asyncHandler(async (req, res) => {
  const { paymentStatus, ...pagination } = parseMyOrderListQuery(req.query);

  const filter = { userId: req.user.userId };
  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }

  const { orders, pagination: meta } = await paginateOrders(filter, pagination);

  res.status(200).json({ success: true, orders, pagination: meta });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  assertCanAccessOrder(order, req, res);

  res.status(200).json({ success: true, order });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const { id, bookingId } = req.params;

  const dbSession = await mongoose.startSession();
  let order;

  try {
    // Booking status and freed spots change together or not at all
    await dbSession.withTransaction(async () => {
      order = await Order.findById(id).session(dbSession);
      if (!order) {
        res.status(404);
        throw new Error('Order not found');
      }
      assertCanAccessOrder(order, req, res);

      const booking = order.bookedClasses.id(bookingId);
      if (!booking) {
        res.status(404);
        throw new Error('Booking not found in this order');
      }
      if (booking.bookingStatus !== 'CONFIRMED') {
        res.status(400);
        throw new Error('Only confirmed bookings can be cancelled');
      }

      const trainingClass = await TrainingClass.findById(booking.classId)
        .select('cancellationWindowHours')
        .session(dbSession);
      const windowHours =
        trainingClass?.cancellationWindowHours ?? DEFAULT_CANCELLATION_WINDOW_HOURS;

      // timeSlot is stored as '<start> - <end>' in the club's timezone
      const startTime = booking.timeSlot.split(' - ')[0];
      const startsAt = zonedDateTimeToUtc(booking.date, startTime, config.club.timezone);
      if (!startsAt) {
        res.status(400);
        throw new Error('Unable to determine the class start time for this booking');
      }

      const deadline = startsAt.getTime() - windowHours * 60 * 60 * 1000;
      if (Date.now() > deadline) {
        res.status(400);
        throw new Error(
          `Bookings can only be cancelled up to ${windowHours} hour(s) before the class starts`
        );
      }

      booking.bookingStatus = 'CANCELLED';
      booking.cancelledAt = new Date();
      await order.save({ session: dbSession });

      // Release the spots and reopen a full session
      const attendees = booking.attendeesCount || 1;
      const classSession = await ClassSession.findOneAndUpdate(
        { _id: booking.sessionId, bookedSpots: { $gte: attendees } },
        { $inc: { bookedSpots: -attendees } },
        { new: true, session: dbSession }
      );
      if (
        classSession &&
        classSession.status === 'FULL' &&
        classSession.bookedSpots < classSession.totalSpots
      ) {
        classSession.status = 'OPEN';
        await classSession.save({ session: dbSession });
      }
    });
  } finally {
    await dbSession.endSession();
  }

  res.status(200).json({ success: true, message: 'Booking cancelled successfully', order });
});

// Admin

const getAllOrders = asyncHandler(async (req, res) => {
  const { paymentStatus, userId, orderNumber, from, to, ...pagination } = parseAdminOrderListQuery(
    req.query
  );

  const filter = {};
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (userId) filter.userId = userId;
  if (orderNumber) filter.orderNumber = orderNumber;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = convertDateOnlyToDate(from);
    if (to) {
      // Inclusive: everything before the start of the following day
      const end = convertDateOnlyToDate(to);
      end.setUTCDate(end.getUTCDate() + 1);
      filter.createdAt.$lt = end;
    }
  }

  const { orders, pagination: meta } = await paginateOrders(filter, pagination, true);

  res.status(200).json({ success: true, orders, pagination: meta });
});

const getOrderByIdForAdmin = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('userId', ORDER_USER_FIELDS);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.status(200).json({ success: true, order });
});

module.exports = {
  getMyOrders,
  getOrderById,
  cancelBooking,
  getAllOrders,
  getOrderByIdForAdmin,
};
