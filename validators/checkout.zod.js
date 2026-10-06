const { z } = require('zod');

const checkoutProcessSchema = z.object({
  paymentDetails: z
    .object({
      method: z.string().trim().min(1).max(100).optional(),
      billingEmail: z.email({ error: 'A valid billing email is required' }).optional(),
    })
    .optional(),
});

const parseCheckoutProcess = (data) => checkoutProcessSchema.parse(data ?? {});

module.exports = {
  checkoutProcessSchema,
  parseCheckoutProcess,
};
