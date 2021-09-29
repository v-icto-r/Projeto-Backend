const { register } = require('../models/salesModel');
const { findOne } = require('../models/productsModel');

const { error } = require('../middlewares/errorMessage');
const {
  success,
  invalid,
  notFoundCode,
} = error.codeStatus;
const {
  invalidData,
  saleInvalid,
  stockProblem,
  unavailableQuantity,
} = error.errorMessage;

const minQuantity = 1;
const zero = 0;

const registerSale = async (productsSold) => {
  let isValid = true;
  let available = true;

  for (let index = zero; index < productsSold.length; index++) {
    const saleProduct = productsSold[index];
    const id = saleProduct.productId;
    const quantity = saleProduct.quantity;
    const product = await findOne(id, null);
    const availableQuantity = product.quantity;
    if (quantity < minQuantity || typeof quantity !== 'number') {
      isValid = false;
      break;
    }
    if (quantity > availableQuantity) {
      available = false;
      break;
    }
  }
  if (!isValid) {
    return ({ 
      statusCode: invalid,
      infos: {
        err: {
          code: invalidData,
          message: saleInvalid,
        },
      },
    });
  }
  //   expect(response).to.
  if (!available) {
    return ({ 
      statusCode: notFoundCode,
      infos: {
        err: {
          code: stockProblem,
          message: unavailableQuantity,
        },
      },
    });
  }
  const result = await register(productsSold);
  return {
    statusCode: success,
    infos: result,
  };
};

module.exports = registerSale;