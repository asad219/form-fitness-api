const { z } = require('zod');

const paymentDetailsSchema = z.object({
  method: z.string().trim().min(1).max(100).optional(),
  billingEmail: z.email({ error: 'A valid billing email is required' }).optional(),
});

const checkoutProcessSchema = z.object({
  paymentDetails: paymentDetailsSchema.optional(),
});

const parseCheckoutProcess = (data) => checkoutProcessSchema.parse(data ?? {});

module.exports = {
  paymentDetailsSchema,
  checkoutProcessSchema,
  parseCheckoutProcess,
};
