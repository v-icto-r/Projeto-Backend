const {
    findOne,
    updateOne,
  } = require('../models/salesModel');
  
  const { error } = require('../middlewares/errorMessage');
  const {
    invalid,
    success,
  } = error.codeStatus;
  const {
    invalidData,
    saleInvalid,
  } = error.errorMessage;
  
  const minQuantity = 1;
  
  const updateSale= async (id, itens) => {
    let isValid = true;
    itens.forEach((product) => {
      const quantity = product.quantity;
      if (quantity < minQuantity || typeof quantity !== 'number') {
        return isValid = false;
      } 
    });
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
    const sale = await findOne(id);
    if (!sale) {
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
    const result = await updateOne(id, itens);
    return {
      statusCode: success,
      infos: result,
    };
  };
  
  module.exports = updateSale;