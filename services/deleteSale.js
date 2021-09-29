const { ObjectId } = require('mongodb');

const {
  deleteOne,
  findOne,
} = require('../models/salesModel');

const { error } = require('../middlewares/errorMessage');
const {
  success,
  notFoundCode,
  invalid,
} = error.codeStatus;
const {
  invalidData,
  invalidSaleID,
  notFound,
  saleNotFound,
} = error.errorMessage;

const deleteSale = async (id) => {
  if (!ObjectId.isValid(id)) {
    return ({ 
      statusCode: invalid,
      infos: {
        err: {
          code: invalidData,
          message: invalidSaleID,
        },
      },
    });
  }
  const sale = await findOne(id);
  if (!sale || sale._id == undefined) {
    return ({
      statusCode: notFoundCode,
      infos: {
        err: {
          code: notFound,
          message: saleNotFound,
        },
      },
    });
  }
  await deleteOne(id);
  return {
    statusCode: success,
    infos: sale,
  };
};

module.exports = deleteSale;