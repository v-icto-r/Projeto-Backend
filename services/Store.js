const { ObjectId } = require('mongodb');
const Store = require('../models/Store');

const LENGTH_NAME = 5;
const ZERO_QUANTITY = 0;

const errLastFiveChar = { err: {
  code: 'invalid_data',
  message: '"name" length must be at least 5 characters long',
} };
const errSameName = { err: {
  code: 'invalid_data',
  message: 'Product already exists',
} };
const errLessOrEqualZero = { err: {
  code: 'invalid_data',
  message: '"quantity" must be larger than or equal to 1',
} };
const errQuantityIsString = { err: {
  code: 'invalid_data',
  message: '"quantity" must be a number',
} };
const errWrongIdFormat = { err: {
  code: 'invalid_data',
  message: 'Wrong id format',
} };

const isNameAlreadyExist = async (name) => {
  const result = await Store.findByName(name);

  if (result !== null) return false;
  return true;
};
const verifyName = (name) => {
  if (!name || typeof name !== 'string' || name.length < LENGTH_NAME) return false;

  return true;
};

const verifyQuantity = (quantity) => {
  if (!quantity || quantity <= ZERO_QUANTITY) return false;

  return true;
};
const verifyTypeOfQuantity = (quantity) => {
  if (!quantity || typeof quantity !== 'number') return false;

  return true;
};
const isValid = async (name, quantity) => {
  const result = await isNameAlreadyExist(name);

  if (!verifyName(name)) return errLastFiveChar;
  if (!result) return errSameName;
  if (!verifyQuantity(quantity)) return errLessOrEqualZero;
  if (!verifyTypeOfQuantity(quantity)) return errQuantityIsString;
  return true;
};

const updateValidation = async (name, quantity) => {
  if (!verifyName(name)) return errLastFiveChar;
  if (!verifyQuantity(quantity)) return errLessOrEqualZero;
  if (!verifyTypeOfQuantity(quantity)) return errQuantityIsString;

  return true;
};

const getAll = async () => {
  const store = await Store.getAll();

  return { products: store };
};

const findById = async (id) => {
  if (!ObjectId.isValid(id)) {
    return errWrongIdFormat;
  }
  const store = await Store.findById(id);

  if (store === null) return errWrongIdFormat;
  return store;
};

const deleteProduct = async (id) => {
  if (!ObjectId.isValid(id)) {
    return errWrongIdFormat;
  }
  const store = await Store.findById(id);

  if (store === null) return errWrongIdFormat;
  await Store.deleteById(id);
  return store;
};

const create = async (name, quantity) => {
  const productValid = await isValid(name, quantity);

  if (typeof productValid === 'object') return productValid;
  const { insertedId } = await Store.create(name, quantity);

  return {
    _id: insertedId,
    name,
    quantity,
  };
};

const updateById = async (name, quantity, id) => {
  if (!ObjectId.isValid(id)) {
    return errWrongIdFormat;
  }
  const productValid = await updateValidation(name, quantity);
  if (typeof productValid === 'object') return productValid;
  await Store.updateById(name, quantity, id);

  return {
    _id: id,
    name,
    quantity,
  };
};

module.exports = {
  updateById,
  deleteProduct,
  getAll,
  findById,
  create,
};