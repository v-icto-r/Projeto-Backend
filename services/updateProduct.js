const {
    findOne,
    updateOne,
  } = require('../models/productsModel');
  
  const { error } = require('../middlewares/errorMessage');
  const {
    invalid,
    success,
  } = error.codeStatus;
  const {
    shortName,
    invalidQuantityValue,
    invalidQuantityType,
    invalidData,
    invalidID,
  } = error.errorMessage;
  
  const nameMinLength = 5;
  const minQuantity = 1;
  
  const updateProduct = async (id, name, quantity) => {
    if (name.length < nameMinLength) {
      return ({ 
        statusCode: invalid,
        infos: {
          err: {
            code: invalidData,
            message: shortName,
          },
        },
      });
    }
    if (quantity < minQuantity) {
      return ({ 
        statusCode: invalid,
        infos: {
          err: {
            code: invalidData,
            message: invalidQuantityValue,
          },
        },
      });
    }
    if (typeof quantity !== 'number') {
      return ({ 
        statusCode: invalid,
        infos: {
          err: {
            code: invalidData,
            message: invalidQuantityType,
          },
        },
      });
    }
    const product = await findOne(id, null);
    if (!product) {
      return ({ 
        statusCode: invalid,
        infos: {
          err: {
            code: invalidData,
            message: invalidID,
          },
        },
      });
    }
    const result = await updateOne(id, name, quantity);
    return {
      statusCode: success,
      infos: result,
    };
  };
  
  module.exports = updateProduct;