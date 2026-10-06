const { z } = require('zod');

const PRODUCT_CATEGORIES = ['APPAREL', 'EQUIPMENT', 'RECOVERY'];

const productListQuerySchema = z.object({
  category: z.enum(PRODUCT_CATEGORIES).optional(),
  search: z.string().trim().min(1, 'Search text cannot be empty').max(100).optional(),
});

const parseProductListQuery = (query) => productListQuerySchema.parse(query);

module.exports = {
  PRODUCT_CATEGORIES,
  productListQuerySchema,
  parseProductListQuery,
};
