const asyncHandler = require('express-async-handler');
const { Cart } = require('../models/cartModel');
const { ClassSession } = require('../models/classSessionModel');
const { Product } = require('../models/productModel');
const {
  parseCartServiceItemAdd,
  parseCartProductItemAdd,
  parseCartItemUpdate,
} = require('../validators/cart.zod');

const CART_POPULATE = [
  { path: 'serviceItems.sessionRef', populate: { path: 'classId' } },
  { path: 'productItems.productRef' },
];

// Every user has at most one cart; create it lazily on first access
const findOrCreateCart = async (userId) => {
  const cart = await Cart.findOne({ userId });
  return cart || Cart.create({ userId });
};

const getCart = asyncHandler(async (req, res) => {
  const cart = await findOrCreateCart(req.user.userId);
  await cart.populate(CART_POPULATE);

  res.status(200).json({
    success: true,
    cart,
  });
});

const addServiceItem = asyncHandler(async (req, res) => {
  const { sessionId, attendeesCount } = parseCartServiceItemAdd(req.body);

  const classSession = await ClassSession.findById(sessionId).populate('classId');
  if (!classSession || !classSession.classId) {
    res.status(404);
    throw new Error('Class session not found');
  }
  if (classSession.status !== 'OPEN') {
    res.status(400);
    throw new Error('This session is not open for booking');
  }
  if (classSession.availableSpots < attendeesCount) {
    res.status(400);
    throw new Error(
      `Only ${classSession.availableSpots} spot(s) left for "${classSession.classId.title}"`
    );
  }

  const cart = await findOrCreateCart(req.user.userId);

  const alreadyInCart = cart.serviceItems.some((item) => item.sessionRef.toString() === sessionId);
  if (alreadyInCart) {
    res.status(400);
    throw new Error('This session is already in your cart');
  }

  cart.serviceItems.push({
    sessionRef: classSession._id,
    attendeesCount,
    price: classSession.classId.price,
  });
  await cart.save();
  await cart.populate(CART_POPULATE);

  res.status(201).json({
    success: true,
    message: 'Class session added to cart',
    cart,
  });
});

const addProductItem = asyncHandler(async (req, res) => {
  const data = parseCartProductItemAdd(req.body);

  const product = await Product.findById(data.productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (product.stockQuantity < data.quantity) {
    res.status(400);
    throw new Error(`Only ${product.stockQuantity} unit(s) left for "${product.name}"`);
  }

  const cart = await findOrCreateCart(req.user.userId);

  // Merge with an existing line when the variant and fulfillment match
  const existingItem = cart.productItems.find(
    (item) =>
      item.productRef.toString() === data.productId &&
      item.selectedColor === data.selectedColor &&
      item.selectedSize === data.selectedSize &&
      item.fulfillmentMethod === data.fulfillmentMethod
  );

  if (existingItem) {
    existingItem.quantity += data.quantity;
  } else {
    cart.productItems.push({
      productRef: product._id,
      quantity: data.quantity,
      selectedColor: data.selectedColor,
      selectedSize: data.selectedSize,
      fulfillmentMethod: data.fulfillmentMethod,
      price: product.price,
    });
  }
  await cart.save();
  await cart.populate(CART_POPULATE);

  res.status(201).json({
    success: true,
    message: 'Product added to cart',
    cart,
  });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const data = parseCartItemUpdate(req.body);

  const cart = await findOrCreateCart(req.user.userId);
  const item = cart.productItems.id(req.params.itemId);

  if (!item) {
    if (cart.serviceItems.id(req.params.itemId)) {
      res.status(400);
      throw new Error('Class bookings cannot be modified; remove the item and book again');
    }
    res.status(404);
    throw new Error('Cart item not found');
  }

  if (data.quantity !== undefined) {
    item.quantity = data.quantity;
  }
  if (data.fulfillmentMethod !== undefined) {
    item.fulfillmentMethod = data.fulfillmentMethod;
  }
  await cart.save();
  await cart.populate(CART_POPULATE);

  res.status(200).json({
    success: true,
    message: 'Cart item updated',
    cart,
  });
});

const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await findOrCreateCart(req.user.userId);

  const isProductItem = Boolean(cart.productItems.id(req.params.itemId));
  const isServiceItem = Boolean(cart.serviceItems.id(req.params.itemId));
  if (!isProductItem && !isServiceItem) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  if (isProductItem) {
    cart.productItems.pull({ _id: req.params.itemId });
  } else {
    cart.serviceItems.pull({ _id: req.params.itemId });
  }
  await cart.save();
  await cart.populate(CART_POPULATE);

  res.status(200).json({
    success: true,
    message: 'Item removed from cart',
    cart,
  });
});

module.exports = {
  getCart,
  addServiceItem,
  addProductItem,
  updateCartItem,
  removeCartItem,
};
