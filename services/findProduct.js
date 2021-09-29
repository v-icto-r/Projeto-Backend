const { findOne } = require('../models/productsModel');

const { error } = require('../middlewares/errorMessage');
const {
  success,
  invalid,
} = error.codeStatus;
const {
  invalidID,
  invalidData,
} = error.errorMessage;

const minID = 24;

const findProduct = async (id) => {
  if (id.length < minID) {
    return ({
      statusCode: invalid,
      infos: {
        err: {
          code: invalidData,
          message: invalidID,
        }
      }
    });
  }
  const result = await findOne(id, null);
  if (!result) {
    return ({
      statusCode: invalid,
      infos: {
        err: {
          code: invalidData,
          message: invalidID,
        }
      }
    });
  };
  return ({
    statusCode: success,
    infos: result,
  });
};

module.exports = findProduct;