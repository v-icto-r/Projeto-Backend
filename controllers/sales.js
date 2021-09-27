const Sales = require('../services/sales');

const INVALID_DATA = 422;
const NOT_FOUND = 404;
// const CREATE = 201;
const retunedProducts = 200;

const getAll = async (_req, res) => {
  const store = await Sales.getAll();

  res.status(retunedProducts).json(store);
};

const findById = async (req, res) => {
  const { id } = req.params;
  const result = await Sales.findById(id);

  if (result.err) return res.status(NOT_FOUND).json(result);

  res.status(retunedProducts).json(result);
};
const updateById = async (req, res) => {
  const { id } = req.params;
  const arr = req.body;

  const result = await Sales.updateById(arr, id);

  if (result.err) return res.status(INVALID_DATA).json(result);

  res.status(retunedProducts).json(result);
};
const deleteSale = async (req, res) => {
  const { id } = req.params;
  const result = await Sales.deleteSale(id);
  if (result.err) return res.status(INVALID_DATA).json(result);

  res.status(retunedProducts).json(result);
};

const create = async (req, res) => {
  const arr = req.body;
  const result = await Sales.create(arr);

  if (result.err) return res.status(INVALID_DATA).json(result);

  res.status(retunedProducts).json(result);
};

module.exports = {
  deleteSale,
  updateById,
  getAll,
  findById,
  create,
};