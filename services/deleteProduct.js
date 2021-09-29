const {
    deleteOne,
    findOne,
  } = require('../models/productsModel');
  
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
  
  const deleteProduct = async (id) => {
    if (id.length < minID) {
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
    const product = await findOne(id);
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
    await deleteOne(id);
    return {
      statusCode: success,
      infos: product,
    };
  };
  
  module.exports = deleteProduct;