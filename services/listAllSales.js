const { listAll } = require('../models/salesModel');

const { error } = require('../middlewares/errorMessage');
const { success } = error.codeStatus;

const listAllSales = async () => {
  const result = await listAll();
  return {
    statusCode: success,
    infos: result,
  };
};

module.exports = listAllSales;