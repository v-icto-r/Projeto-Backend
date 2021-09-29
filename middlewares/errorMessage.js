const error = {
    codeStatus: {
      success: 200,
      created: 201,
      notFoundCode: 404,
      invalid: 422,
    },
    errorMessage: {
      invalidData: 'invalid_data',
      shortName: '"name" length must be at least 5 characters long',
      invalidQuantityValue: '"quantity" must be larger than or equal to 1',
      invalidQuantityType: '"quantity" must be a number',
      duplicatedProduct: 'Product already exists',
      invalidID: 'Wrong id format',
      saleInvalid: 'Wrong product ID or invalid quantity',
      saleNotFound: 'Sale not found',
      invalidSaleID: 'Wrong sale ID format',
      stockProblem: 'stock_problem',
      unavailableQuantity: 'Such amount is not permitted to sell',
      notFound: 'not_found',
    },
  };
  
  module.exports = {
    error,
  };