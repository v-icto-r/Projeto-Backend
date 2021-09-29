const rescue = require('express-rescue');

const {
  deleteProduct,
  findProduct,
  listAllProducts,
  registerProduct,
  updateProduct,
} = require('../services');

const registerProductController = rescue(async (req, res, _next) => {
  const { name, quantity } = req.body;
  const result = await registerProduct(name, quantity);
  res.status(result.statusCode).json(result.infos);
});

const listAllProductsController = rescue(async (_req, res, _next) => {
  const result = await listAllProducts();
  res.status(result.statusCode).json(result.infos);
});

const findProductController = rescue(async (req, res, _next) => {
  const { id } = req.params;
  const result = await findProduct(id);
  res.status(result.statusCode).json(result.infos);
});

const updateProductController = rescue(async (req, res, _next) => {
  const { id } = req.params;
  const { name, quantity } = req.body;
  const result = await updateProduct(id, name, quantity);
  res.status(result.statusCode).json(result.infos);
});

const deleteProductController = rescue(async (req, res, _next) => {
  const { id } = req.params;
  const result = await deleteProduct(id);
  res.status(result.statusCode).json(result.infos);
});

module.exports = {
  registerProductController,
  findProductController,
  listAllProductsController,
  updateProductController,
  deleteProductController
};