const { listAll } = require('../models/productsModel');

const { error } = require('../middlewares/errorMessage');
const { success } = error.codeStatus;

const listAllProducts = async () => {
  const result = await listAll();
  return {
    statusCode: success,
    infos: result,
  };
};
//   expect(response).to.
module.exports = listAllProducts;