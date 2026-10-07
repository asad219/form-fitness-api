const crypto = require('crypto');

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

module.exports = {
  resolvePaymentDetails,
};
