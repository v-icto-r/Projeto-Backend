const { expect } = require('chai');

const {
  deleteProduct,
  findProduct,
  listAllProducts,
  registerProduct,
  updateProduct,
  deleteSale,
  findSale,
  listAllSales,
  registerSale,
  updateSale,
} = require('../../services');

const invalidPayloadProduct = {};
const invalidId = 123;
const validId = '46d15de55ab82df81a89c7ea';
const invalidName = 'Lua';
const validName = 'Colar da Lua';
const invalidQuantity = -1;
const invalidTypeQuantity = 'dez';
const validQuantity = 10;
const invalidPayloadSale = [];
// const validPayloadSale = [
//   { productId: '46d15de55ab82df81a89c7ea', quantity: 2 },
//   { productId: '2549a26b49de19a783bf841d', quantity: 5 },
// ]

describe('Testes: Camada Services - Products', () => {
  describe('Registar um novo produto', () => {
    it('quando o payload informado NÃO é válido', async () => {
      const response = await registerProduct(invalidPayloadProduct);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
    it('quando o nome NÃO é válido', async () => {
      const response = await registerProduct(invalidName, validQuantity);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
    it('quando a quantidade NÃO é válida', async () => {
      const response = await registerProduct(validName, invalidQuantity);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
    it('quando o tipo da quantidade NÃO é válido', async () => {
      const response = await registerProduct(validName, invalidTypeQuantity);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
    it('quando é inserido com sucesso', async () => {
      const response = await registerProduct(validName, validQuantity);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
    it('quando o produto já existe', async () => {
      await registerProduct(validName, validQuantity);
      const response = await registerProduct(validName, validQuantity);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
  });

  describe('Listar todos os produtos', () => {
    it('quando NÃO há produtos', async () => {
      const response = await listAllProducts();
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
    it('quando há produtos', async () => {
      await registerProduct(validName, validQuantity);
      const response = await listAllProducts();
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
  });

  describe('Encontrar um produto', () => {
    it('quando o id NÃO é válido', async () => {
      const response = await findProduct(invalidId);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });

    it('quando NÃO encontra o produto', async () => {
      const response = await findProduct(validId);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
  });

  describe('Atualizar um produto', () => {
    it('quando o nome NÃO é válido', async () => {
      const response = await updateProduct(validId, invalidName, validQuantity);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
    it('quando a quantidade NÃO é válida', async () => {
      const response = await updateProduct(validId, validName, invalidQuantity);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
    it('quando o tipo da quantidade NÃO é válido', async () => {
      const response = await updateProduct(validId, validName, invalidTypeQuantity);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
    it('quando NÃO encontra o produto', async () => {
      const response = await updateProduct(validId, validName, validQuantity);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
  });

  describe('Deletar um produto', () => {
    it('quando o id NÃO é válido', async () => {
      const response = await deleteProduct(invalidId);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
    it('quando NÃO encontra o produto', async () => {
      const response = await deleteProduct(validId);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
  });
});

describe('Testes: Camada Services - Sales', () => {
  describe('Registar uma nova venda', () => {
    it('quando o payload informado NÃO é válido', async () => {
      const response = await registerSale(invalidPayloadSale);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
    // it('quando é inserido com sucesso', async () => {
    //   const response = await registerSale(validPayloadSale);
    //   expect(response).to.be.a('object');
    //   expect(response).to.have.a.property('statusCode');
    // });
  });

  describe('Listar todas as vendas', () => {
    it('quando NÃO há vendas', async () => {
      const response = await listAllSales();
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
    it('quando há vendas', async () => {
      const response = await listAllSales();
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
  });

  describe('Encontrar uma venda', () => {
    it('quando o id NÃO é válido', async () => {
      const response = await findSale(invalidId);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });

    it('quando NÃO encontra a venda', async () => {
      const response = await findSale(validId);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
  });

  describe('Atualizar uma venda', () => {
    it('quando a quantidade NÃO é válida', async () => {
      const response = await updateSale(validId, [{ validName, invalidQuantity }]);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
    it('quando o tipo da quantidade NÃO é válido', async () => {
      const response = await updateSale(validId, [{ validName, invalidTypeQuantity }]);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
    it('quando NÃO encontra a venda', async () => {
      const response = await updateSale(validId, [{ validName, validQuantity }]);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
  });

  describe('Deletar uma venda', () => {
    it('quando o id NÃO é válido', async () => {
      const response = await deleteSale(invalidId);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
    it('quando NÃO encontra a venda', async () => {
      const response = await deleteSale(validId);
      expect(response).to.be.a('object');
      expect(response).to.have.a.property('statusCode');
    });
  });
});