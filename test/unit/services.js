const { expect } = require('chai');
const sinon = require('sinon');

const productsService = require('../../services/productsService');
const productsModel = require('../../models/productsModel');

const mockId = '604cb554311d68f491ba5781';

describe('products - testa o service addProduct', () => {
  describe('quando o post é inválido', () => {
    it('quando o nome já existe', async () => {
      sinon.stub(productsModel, 'getByName').resolves([{
        _id: mockId,
        name: 'produto',
        quantity: 50,
      }]);

      const addedProduct = await productsService.addProduct({
        name: 'produto',
        quantity: 10,
      })

      expect(addedProduct).to.deep.equal({
        code: 'invalid_data',
        message: 'Product already exists'
      });
      productsModel.getByName.restore();
    })

    it('quando o nome é inválido', async () => {
      sinon.stub(productsModel, 'getByName').resolves([]);

      const addedProduct = await productsService.addProduct({
        name: 'zé',
        quantity: 10,
      })

      expect(addedProduct).to.deep.equal({
        code: 'invalid_data',
        message: '"name" length must be at least 5 characters long'
      });
      productsModel.getByName.restore();
    });

    it('quando a quantidade não é um numero', async () => {
      sinon.stub(productsModel, 'getByName').resolves([]);

      const addedProduct = await productsService.addProduct({
        name: 'produto',
        quantity: 'oi',
      })

      expect(addedProduct).to.deep.equal({
        code: 'invalid_data',
        message: '"quantity" must be a number'
      });
      productsModel.getByName.restore();
    });

    it('quando a quantidade é um numero inválido', async () => {
      sinon.stub(productsModel, 'getByName').resolves([]);

      const addedProduct = await productsService.addProduct({
        name: 'produto',
        quantity: -5,
      })

      expect(addedProduct).to.deep.equal({
        code: 'invalid_data',
        message: '"quantity" must be larger than or equal to 1'
      });
      productsModel.getByName.restore();
    });
  });

  describe('quando o post é válido', () => {
    it('adição válida', async () => {
      sinon.stub(productsModel, 'getByName').resolves([]);
      sinon.stub(productsModel, 'addProduct').resolves({
        _id: mockId,
        name: 'produto',
        quantity: 10
      });

      const addedProduct = await productsService.addProduct({
        name: 'produto',
        quantity: 10,
      })

      expect(addedProduct).to.deep.equal({
        _id: mockId,
        name: 'produto',
        quantity: 10
      });

      productsModel.getByName.restore();
      productsModel.addProduct.restore();
    });
  });
});

describe('products - testa o service updateProduct', () => {
  describe('quando o update é inválido', () => {
    it('quando o nome é inválido', async () => {
      sinon.stub(productsModel, 'getByName').resolves([]);

      const updatedProduct = await productsService.updateProduct({
        id: mockId,
        name: 'zé',
        quantity: 10,
      })

      expect(updatedProduct).to.deep.equal({
        code: 'invalid_data',
        message: '"name" length must be at least 5 characters long'
      });
      productsModel.getByName.restore();
    });

    it('quando a quantidade não é um numero', async () => {
      sinon.stub(productsModel, 'getByName').resolves([]);

      const updatedProduct = await productsService.updateProduct({
        id: mockId,
        name: 'produto',
        quantity: 'oi',
      })

      expect(updatedProduct).to.deep.equal({
        code: 'invalid_data',
        message: '"quantity" must be a number'
      });
      productsModel.getByName.restore();
    });

    it('quando a quantidade é um numero inválido', async () => {
      sinon.stub(productsModel, 'getByName').resolves([]);

      const updatedProduct = await productsService.updateProduct({
        id: mockId,
        name: 'produto',
        quantity: -5,
      })

      expect(updatedProduct).to.deep.equal({
        code: 'invalid_data',
        message: '"quantity" must be larger than or equal to 1'
      });
      productsModel.getByName.restore();
    });
  });

  describe('quando o update é válido', () => {
    it('update válido', async () => {
      sinon.stub(productsModel, 'getByName').resolves([]);
      sinon.stub(productsModel, 'updateProduct').resolves({
        _id: mockId,
        name: 'produto',
        quantity: 15
      });

      const updatedProduct = await productsService.updateProduct({
        id: mockId,
        name: 'produto',
        quantity: 15,
      })

      expect(updatedProduct).to.deep.equal({
        _id: mockId,
        name: 'produto',
        quantity: 15
      });

      productsModel.getByName.restore();
      productsModel.updateProduct.restore();
    });
  })
});

describe('products - testa o deleteProduct', () => {
  describe('tentando deletar um produto inexistente', () => {
    it('produto inexistente', async () => {
      sinon.stub(productsModel, 'getById').resolves(null);

      const deletedProduct = await productsService.deleteProduct(mockId);

      expect(deletedProduct).to.deep.equal({
        code: 'invalid_data',
        message: 'Wrong id format'
      })
      productsModel.getById.restore();
    });
  });

  describe('tentando deletar um produto que existe', () => {
    it('deleta com sucesso', async () => {
      sinon.stub(productsModel, 'getById').resolves({
        _id: mockId,
        name: 'produto',
        quantity: 10,
      });
      sinon.stub(productsModel, 'deleteProduct').resolves({
        _id: mockId
      })

      const deletedProduct = await productsService.deleteProduct(mockId);

      expect(deletedProduct).to.deep.equal({
        _id: mockId,
        name: 'produto',
        quantity: 10
      })
      productsModel.getById.restore();
      productsModel.deleteProduct.restore();
    });
  });
});

// tests for salesServices
const salesService = require('../../services/salesService');
const salesModel = require('../../models/salesModel');

describe('sales - testa o service addSales', () => {
  describe('ao tentar cadastrar uma venda inválida', () => {
    it('quando a quantidade é inválida', async () => {
      const addedSale = await salesService.addSales([{
        productId: mockId,
        quantity: -1,
      }]);

      expect(addedSale).to.deep.equal({
        code: 'invalid_data',
        message: 'Wrong product ID or invalid quantity'
      });
    });
    it('quando o produto é inválido', async () => {
      const addedSale = await salesService.addSales([{
        productId: '123456789',
        quantity: 5,
      }]);

      expect(addedSale).to.deep.equal({
        code: 'invalid_data',
        message: 'Wrong product ID or invalid quantity'
      });
    });
    it('quando não há estoque', async () => {
      sinon.stub(productsModel, 'getById').resolves({
        _id: mockId,
        name: 'produto',
        quantity: 3
      });

      const addedSale = await salesService.addSales([{
        productId: mockId,
        quantity: 5,
      }]);

      expect(addedSale).to.deep.equal({
        code: 'stock_problem',
        message: 'Such amount is not permitted to sell'
      });
      productsModel.getById.restore();
    });
  });
  describe('ao cadastrar uma venda válida', () => {
    it('cadastro ocorre com sucesso', async () => {
      sinon.stub(productsModel, 'getById').resolves({
        _id: mockId,
        name: 'produto',
        quantity: 15
      });
      sinon.stub(productsModel, 'updateProductQty').resolves({
        _id: mockId,
        quantity: 10
      });
      sinon.stub(salesModel, 'addSales').resolves({
        _id: mockId,
        itensSold: [{ productId: mockId, quantity: 5 }]
      });

      const addedSale = await salesService.addSales([{
        productId: mockId,
        quantity: 5,
      }]);

      expect(addedSale).to.deep.equal({
        _id: '604cb554311d68f491ba5781',
        itensSold: [{ productId: '604cb554311d68f491ba5781', quantity: 5 }]
      });

      productsModel.getById.restore();
      productsModel.updateProductQty.restore();
      salesModel.addSales.restore();
    });
  })
});

describe('sales - testa o service updateSales', () => {
  describe('ao tentar atualizar uma venda inválida', () => {
    it('quando a quantidade é inválida', async () => {
      const updatedSale = await salesService.updateSales({
        id: mockId,
        productId: mockId,
        quantity: -1,
      });

      expect(updatedSale).to.deep.equal({
        code: 'invalid_data',
        message: 'Wrong product ID or invalid quantity'
      });
    });
    it('quando o produto é inválido', async () => {
      const updatedSale = await salesService.updateSales({
        id: mockId,
        productId: '123456789',
        quantity: 10,
      });

      expect(updatedSale).to.deep.equal({
        code: 'invalid_data',
        message: 'Wrong product ID or invalid quantity'
      });
    });
    it('quando a venda não existe', async () => {
      sinon.stub(salesModel, 'getById').resolves(null)
      sinon.stub(productsModel, 'getById').resolves({

      });

      const updatedSale = await salesService.updateSales({
        id: '12345789',
        productId: mockId,
        quantity: 10,
      });

      expect(updatedSale).to.deep.equal({
        code: 'invalid_data',
        message: 'Wrong product ID or invalid quantity'
      });

      salesModel.getById.restore();
      productsModel.getById.restore();
    });
    it('quando não há estoque', async () => { });
  });
  describe('ao atualizar uma venda válida', () => {
    it('venda é atualizada', async () => { })
  });
});

describe('sales - testa o service deleteSales', () => {
  describe('ao tentar deletar uma venda inválida', () => {
    it('venda não existe', async () => { });
  })
  describe('ao tentar deletar uma venda válida', () => {
    it('venda é deletada com sucesso', async () => { });
  })
});
