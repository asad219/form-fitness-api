const crypto = require('crypto');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const { Cart } = require('../models/cartModel');
const { ClassSession } = require('../models/classSessionModel');
const { Product } = require('../models/productModel');
const { Order } = require('../models/orderModel');
const { User } = require('../models/userModel');
const { parseCheckoutProcess } = require('../validators/checkout.zod');
const { roundMoney } = require('../utils/pricingUtils');

// Snapshot payment details from the request or the user's default saved card (no gateway yet)
const resolvePaymentDetails = (paymentDetails, user) => {
  const defaultCard =
    user.savedPaymentMethods.find((method) => method.isDefault) || user.savedPaymentMethods[0];

  return {
    method:
      paymentDetails?.method ||
      (defaultCard ? `${defaultCard.cardBrand} •••• ${defaultCard.last4}` : 'CARD'),
    billingEmail: paymentDetails?.billingEmail || user.email,
    transactionId: `txn_${crypto.randomUUID()}`,
  };
};

const processCheckout = asyncHandler(async (req, res) => {
  const { paymentDetails } = parseCheckoutProcess(req.body);
  const userId = req.user.userId;

  const dbSession = await mongoose.startSession();
  let order;

  try {
    // The whole checkout is one transaction: any failure rolls back spots and stock
    await dbSession.withTransaction(async () => {
      const cart = await Cart.findOne({ userId }).session(dbSession);
      if (!cart || (cart.serviceItems.length === 0 && cart.productItems.length === 0)) {
        res.status(400);
        throw new Error('Your cart is empty');
      }

      const bookedClasses = [];
      for (const item of cart.serviceItems) {
        const classSession = await ClassSession.findById(item.sessionRef)
          .populate('classId')
          .session(dbSession);

        if (!classSession || !classSession.classId || classSession.status === 'CANCELLED') {
          res.status(400);
          throw new Error('A class session in your cart is no longer available');
        }

        // Atomic capacity guard: only increments when enough spots remain
        const updatedSession = await ClassSession.findOneAndUpdate(
          {
            _id: classSession._id,
            status: 'OPEN',
            bookedSpots: { $lte: classSession.totalSpots - item.attendeesCount },
          },
          { $inc: { bookedSpots: item.attendeesCount } },
          { new: true, session: dbSession }
        );
        if (!updatedSession) {
          res.status(409);
          throw new Error(`"${classSession.classId.title}" does not have enough spots left`);
        }
        if (updatedSession.bookedSpots >= updatedSession.totalSpots) {
          updatedSession.status = 'FULL';
          await updatedSession.save({ session: dbSession });
        }

        bookedClasses.push({
          classId: classSession.classId._id,
          sessionId: classSession._id,
          className: classSession.classId.title,
          date: classSession.date,
          timeSlot: `${classSession.startTime} - ${classSession.endTime}`,
          location: classSession.location,
          coachName: classSession.classId.coachName,
          price: roundMoney(item.price * item.attendeesCount),
          entryPassToken: crypto.randomUUID(),
        });
      }

      const purchasedProducts = [];
      for (const item of cart.productItems) {
        // Atomic stock guard: only decrements when enough units remain
        const product = await Product.findOneAndUpdate(
          { _id: item.productRef, stockQuantity: { $gte: item.quantity } },
          { $inc: { stockQuantity: -item.quantity } },
          { new: true, session: dbSession }
        );
        if (!product) {
          res.status(409);
          throw new Error('A product in your cart does not have enough stock left');
        }

        purchasedProducts.push({
          productId: product._id,
          name: product.name,
          quantity: item.quantity,
          price: item.price,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          fulfillmentMethod: item.fulfillmentMethod,
          pickupLocation:
            item.fulfillmentMethod === 'CLUB_PICKUP' ? product.pickupLocation : undefined,
        });
      }

      const user = await User.findById(userId).session(dbSession);
      const orderNumber = `FRM-${crypto.randomInt(10000, 100000)}`;

      [order] = await Order.create(
        [
          {
            orderNumber,
            userId,
            paymentStatus: 'PAID',
            paymentDetails: resolvePaymentDetails(paymentDetails, user),
            bookedClasses,
            purchasedProducts,
            subtotal: cart.subtotal,
            shippingFee: cart.deliveryFee,
            tax: cart.estimatedTax,
            totalPaid: cart.total,
          },
        ],
        { session: dbSession }
      );

      // Wipe the cart once the order is created
      await Cart.deleteOne({ _id: cart._id }).session(dbSession);
    });
  } finally {
    await dbSession.endSession();
  }

  res.status(201).json({
    success: true,
    message: 'Order completed successfully',
    order,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (req.user.role !== 'admin' && order.userId.toString() !== String(req.user.userId)) {
    res.status(403);
    throw new Error('Access denied: You do not have permission to access this resource');
  }

  res.status(200).json({
    success: true,
    order,
  });
});

module.exports = {
  processCheckout,
  getOrderById,
};
