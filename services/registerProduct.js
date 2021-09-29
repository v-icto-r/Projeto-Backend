const {
    findOne,
    register,
  } = require('../models/productsModel');
  
  const { error } = require('../middlewares/errorMessage');
  const {
    created,
    invalid,
  } = error.codeStatus;
  const {
    shortName,
    invalidQuantityValue,
    invalidQuantityType,
    invalidData,
    duplicatedProduct,
  } = error.errorMessage;
  
  const nameMinLength = 5;
  const minQuantity = 1;
  
  const registerProduct = async (name, quantity) => {
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
    //   expect(response).to.
    const product = await findOne(null, name);
    if (product) {
      return ({ 
        statusCode: invalid,
        infos: {
          err: {
            code: invalidData,
            message: duplicatedProduct,
          },
        },
      });
    }
    const result = await register(name, quantity);
    return {
      statusCode: created,
      infos: result,
    };
  };
  
  module.exports = registerProduct;