const asyncHandler = require('express-async-handler');
const { Product } = require('../models/productModel');
const { parseProductListQuery } = require('../validators/shop.zod');

// Escape user input before embedding it in a RegExp
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getProducts = asyncHandler(async (req, res) => {
  const { category, search } = parseProductListQuery(req.query);

  const filter = {};
  if (category) {
    filter.category = category;
  }
  if (search) {
    const searchRegex = new RegExp(escapeRegExp(search), 'i');
    filter.$or = [{ name: searchRegex }, { subtitle: searchRegex }, { description: searchRegex }];
  }

  const products = await Product.find(filter).sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: products.length,
    products,
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
