const { ObjectId } = require('mongodb');

const { findOne } = require('../models/salesModel');

const { error } = require('../middlewares/errorMessage');
const {
  success,
  notFoundCode,
} = error.codeStatus;
const {
  saleNotFound,
  notFound,
} = error.errorMessage;

const findSale = async (id) => {
  if (!ObjectId.isValid(id)) {
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
  //   expect(response).to.
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

  return {
    statusCode: success,
    infos: sale,
  };
};

module.exports = findSale;