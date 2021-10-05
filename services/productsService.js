const productsModel = require('../models/productsModel');

const code = 'invalid_data';

async function nameExists(name) {
  // checks if the product's name is in the data
  const productsByName = await productsModel.getByName(name);

  if (!productsByName.length) return { result: false };
  return {
    result: true,
    message: 'Product already exists',
  };
}

async function nameIsValid(name) {
  const nameLength = name.length;

  if (nameLength >= 5) return { result: true };
  return {
    result: false,
    message: '"name" length must be at least 5 characters long',
  };
}

async function quantityIsNumber(quantity) {
  const isNumber = typeof quantity === 'number';

  if (isNumber) return { result: true };
  return {
    result: false,
    message: '"quantity" must be a number',
  };
}

async function quantityIsValid(quantity) {
  const isPositive = quantity > 0;

  if (isPositive) return { result: true };
  return {
    result: false,
    message: '"quantity" must be larger than or equal to 1',
  };
}

async function getAll() {
  const products = await productsModel.getAll();
  return products;
}

async function getById(id) {
  const productsById = await productsModel.getById(id);

  if (!productsById) return { code, message: 'Wrong id format' };
  return productsById;
}

async function addProduct({ name, quantity }) {
  const productNameExists = await nameExists(name);
  if (productNameExists.result) return { code, message: productNameExists.message };

  const productNameIsValid = await nameIsValid(name);
  if (!productNameIsValid.result) return { code, message: productNameIsValid.message };

  const productQuantityIsNumber = await quantityIsNumber(quantity);
  if (!productQuantityIsNumber.result) return { code, message: productQuantityIsNumber.message };

  const productQuantityIsValid = await quantityIsValid(quantity);
  if (!productQuantityIsValid.result) return { code, message: productQuantityIsValid.message };

  const addedProduct = await productsModel.addProduct({ name, quantity });
  return addedProduct;
}

async function updateProduct({ id, name, quantity }) {
  const productNameIsValid = await nameIsValid(name);
  if (!productNameIsValid.result) return { code, message: productNameIsValid.message };

  const productQuantityIsNumber = await quantityIsNumber(quantity);
  if (!productQuantityIsNumber.result) return { code, message: productQuantityIsNumber.message };

  const productQuantityIsValid = await quantityIsValid(quantity);
  if (!productQuantityIsValid.result) return { code, message: productQuantityIsValid.message };

  const updatedProduct = await productsModel.updateProduct({ id, name, quantity });
  return updatedProduct;
}

async function deleteProduct(id) {
  const productById = await getById(id);

  if (productById.message) return productById;

  const { _id } = await productsModel.deleteProduct(id);

  return {
    _id,
    name: productById.name,
    quantity: productById.quantity,
  };
}

module.exports = {
  getAll,
  getById,
  addProduct,
  updateProduct,
  deleteProduct,
};
