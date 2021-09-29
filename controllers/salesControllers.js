const rescue = require('express-rescue');

const {
  registerSale,
  listAllSales,
  findSale,
  updateSale,
  deleteSale,
} = require('../services');

const registerSaleController = rescue(async (req, res, _next) => {
  const productsSold = req.body;
  const result = await registerSale(productsSold);
  res.status(result.statusCode).json(result.infos);
});

const listAllSalesController = rescue(async (_req, res, _next) => {
  const result = await listAllSales();
  res.status(result.statusCode).json(result.infos);
});

const findSaleController = rescue(async (req, res, _next) => {
  const { id } = req.params;
  const result = await findSale(id);
  res.status(result.statusCode).json(result.infos);
});

const updateSaleController = rescue(async (req, res, _next) => {
  const { id } = req.params;
  const itens = req.body;
  const result = await updateSale(id, itens);
  res.status(result.statusCode).json(result.infos);
});

const deleteSaleController = rescue(async (req, res, _next) => {
  const { id } = req.params;
  const result = await deleteSale(id);
  res.status(result.statusCode).json(result.infos);
});

module.exports = {
  registerSaleController,
  findSaleController,
  listAllSalesController,
  updateSaleController,
  deleteSaleController
};