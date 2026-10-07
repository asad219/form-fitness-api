const asyncHandler = require('express-async-handler');
const { Product } = require('../models/productModel');
const { parseProductListQuery } = require('../validators/shop.zod');

// Escape user input before embedding it in a RegExp
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getProducts = asyncHandler(async (req, res) => {
  const { page, limit, category, search } = parseProductListQuery(req.query);
  const skip = (page - 1) * limit;

  const filter = {};
  if (category) {
    filter.category = category;
  }
  if (search) {
    const searchRegex = new RegExp(escapeRegExp(search), 'i');
    filter.$or = [{ name: searchRegex }, { subtitle: searchRegex }, { description: searchRegex }];
  }

  // _id tie-breaker keeps page boundaries stable when names repeat
  const [products, total] = await Promise.all([
    Product.find(filter).sort({ name: 1, _id: 1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({
    success: true,
    product,
  });
});

module.exports = {
  getProducts,
  getProductById,
};
