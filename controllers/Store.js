const Store = require('../services/Store');

const INVALID_DATA = 422;
const CREATE = 201;
const retunedProducts = 200;

const getAll = async (_req, res) => {
  const store = await Store.getAll();

  res.status(retunedProducts).json(store);
};

const findById = async (req, res) => {
  const { id } = req.params;
  const store = await Store.findById(id);

  if (store.err) return res.status(INVALID_DATA).json(store);
  res.status(retunedProducts).json(store);
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body;

  const result = await Store.updateById(name, quantity, id);

  if (result.err) return res.status(INVALID_DATA).json(result);
  res.status(retunedProducts).json(result);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const store = await Store.deleteProduct(id);

  if (store.err) return res.status(INVALID_DATA).json(store);
  res.status(retunedProducts).json(store);
};

const create = async (req, res) => {
  const { name, quantity } = req.body;
  const store = await Store.create(name, quantity);

  if (store.err) return res.status(INVALID_DATA).json(store);
  res.status(CREATE).json(store);
};

module.exports = {
  create,
  getAll,
  findById,  
  updateById,
  deleteProduct, 
};