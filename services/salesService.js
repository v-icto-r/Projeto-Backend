const salesModel = require('../models/salesModel');
const productsModel = require('../models/productsModel');

const invalidErrorMsg = 'Wrong product ID or invalid quantity';
const notFoundErrorMsg = 'Sale not found';
const invalidSaleErrorMsg = 'Wrong sale ID format';
const stockProblemMsg = 'Such amount is not permitted to sell';

const invalidCode = 'invalid_data';
const notFoundCode = 'not_found';
const stockCode = 'stock_problem';

function quantityIsValid(quantity) {
  const isNumber = typeof quantity === 'number';
  const isValid = quantity > 0;

  if (!isNumber || !isValid) return false;
  return true;
}

async function productIsValid(productId) {
  const product = await productsModel.getById(productId);

  if (!product) return false;
  return true;
}

async function getAll() {
  const sales = await salesModel.getAll();
  return sales;
}

async function getById(id) {
  const saleById = await salesModel.getById(id);

  if (!saleById) return { code: notFoundCode, message: notFoundErrorMsg };

  return saleById;
}

async function checkProductStock(productId) {
  const product = await productsModel.getById(productId);

  if (!product) return 0;
  return product.quantity;
}

async function saleHasStock(salesList) {
  const productsStock = await Promise.all(
    salesList.map((sale) => checkProductStock(sale.productId)),
  );

  if (!salesList.every((sale, index) => sale.quantity <= productsStock[index])) {
    return false;
  }
  return true;
}

async function updateStock(salesList) {
  const hasStock = await saleHasStock(salesList);
  if (!hasStock) return { code: stockCode, message: stockProblemMsg };

  salesList.forEach(async (sale) => {
    const { productId, quantity } = sale;
    const currentStock = await checkProductStock(productId);
    await productsModel.updateProductQty(productId, (currentStock - quantity));
  });
  return {};
}

async function addSales(salesList) {
  const isSaleQtyValid = await salesList.map((sale) => sale.quantity).every(quantityIsValid);
  if (!isSaleQtyValid) return { code: invalidCode, message: invalidErrorMsg };

  const isSaleProductValid = await Promise.all(
    salesList.map((sale) => productIsValid(sale.productId)),
  );
  if (!isSaleProductValid.every((e) => e)) return { code: invalidCode, message: invalidErrorMsg };

  // update stock
  const updateStockResponse = await updateStock(salesList);
  if (updateStockResponse.message) return updateStockResponse;

  const addedSales = await salesModel.addSales(salesList);
  return addedSales;
}

async function updateSales({ id, productId, quantity }) {
  const validQuantity = quantityIsValid(quantity);
  if (!validQuantity) return { code: invalidCode, message: invalidErrorMsg };

  const validProduct = await productIsValid(productId);
  if (!validProduct) return { code: invalidCode, message: invalidErrorMsg };

  const validSale = await getById(id);
  if (validSale.message) return { code: invalidCode, message: invalidErrorMsg };

  const currentStock = await checkProductStock(productId);
  const currentSaleQty = validSale.itensSold.find((i) => i.productId === productId).quantity;
  const newStockQty = currentStock + currentSaleQty - quantity;

  if (newStockQty < 0) return { code: stockCode, message: stockProblemMsg };
  await productsModel.updateProductQty(productId, newStockQty);

  const updatedSales = await salesModel.updateSales({ id, productId, quantity });
  return updatedSales;
}

async function deleteSales(id) {
  const validSale = await getById(id);

  if (validSale.message) return { code: invalidCode, message: invalidSaleErrorMsg };

  validSale.itensSold.forEach(async (i) => {
    const currentStock = await checkProductStock(i.productId);
    const newStockQty = currentStock + i.quantity;
    await productsModel.updateProductQty(i.productId, newStockQty);
  });

  await salesModel.deleteSales(id);
  return validSale;
}

module.exports = {
  getAll,
  getById,
  addSales,
  updateSales,
  deleteSales,
};
