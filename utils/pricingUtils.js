// Flat shipping fee applied when any cart product ships, and sales tax rate
const SHIPPING_FEE_FLAT = 5;
const TAX_RATE = 0.08;

// Avoid floating point drift on money values
const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const computeCartTotals = (cart) => {
  const serviceTotal = cart.serviceItems.reduce(
    (sum, item) => sum + item.price * item.attendeesCount,
    0
  );
  const productTotal = cart.productItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const subtotal = roundMoney(serviceTotal + productTotal);
  const discount = Math.min(cart.discountAmount || 0, subtotal);
  const hasShippedItems = cart.productItems.some((item) => item.fulfillmentMethod === 'SHIP_TO_ME');
  const deliveryFee = hasShippedItems ? SHIPPING_FEE_FLAT : 0;
  const estimatedTax = roundMoney((subtotal - discount) * TAX_RATE);
  const total = roundMoney(subtotal - discount + deliveryFee + estimatedTax);

  return { subtotal, deliveryFee, estimatedTax, total };
};

module.exports = {
  SHIPPING_FEE_FLAT,
  TAX_RATE,
  roundMoney,
  computeCartTotals,
};
