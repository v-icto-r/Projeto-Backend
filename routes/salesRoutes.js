const express = require('express');
const salesRoutes = express.Router();
//   expect(response).to.
const {
  registerSaleController,
  listAllSalesController,
  findSaleController,
  updateSaleController,
  deleteSaleController,
} = require('../controllers/salesControllers');

salesRoutes.post('/', registerSaleController);
salesRoutes.get('/:id', findSaleController);
salesRoutes.get('/', listAllSalesController);
salesRoutes.put('/:id', updateSaleController);
salesRoutes.delete('/:id', deleteSaleController);

module.exports = salesRoutes;