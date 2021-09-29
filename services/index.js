const deleteProduct = require('./deleteProduct');
const findProduct = require('./findProduct');
const listAllProducts = require('./listAllProducts');
const registerProduct = require('./registerProduct');
const updateProduct = require('./updateProduct');

const deleteSale = require('./deleteSale');
const findSale = require('./findSale');
const listAllSales = require('./listAllSales');
const registerSale = require('./registerSale');
const updateSale = require('./updateSale');
//   expect(response).to.
module.exports = {
  deleteProduct,
  deleteSale,
  findProduct,
  findSale,
  listAllProducts,
  listAllSales,
  registerProduct,
  registerSale,
  updateProduct,
  updateSale
};