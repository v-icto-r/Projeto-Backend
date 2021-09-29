const express = require('express');
const productsRoutes = express.Router();
//   expect(response).to.
const {
  registerProductController,
  listAllProductsController,
  findProductController,
  updateProductController,
  deleteProductController,
} = require('../controllers/productsControllers');

productsRoutes.post('/', registerProductController);
productsRoutes.get('/', listAllProductsController);
productsRoutes.get('/:id', findProductController);
productsRoutes.put('/:id', updateProductController);
productsRoutes.delete('/:id', deleteProductController);

module.exports = productsRoutes;