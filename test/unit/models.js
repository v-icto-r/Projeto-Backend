const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient, ObjectId } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoConnection = require('../../models/connection');

const productsModel = require('../../models/productsModel');
const salesModel = require('../../models/salesModel');

let connectionMock;
before(async () => {
  const DBServer = new MongoMemoryServer();
  const URLMock = await DBServer.getUri();

  connectionMock = await MongoClient.connect(
    URLMock,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  connectionMock = connectionMock.db('StoreManager')

  sinon.stub(mongoConnection, 'getConnection').resolves(connectionMock);
});

// Restauraremos a função `getConnection` original após os testes.
after(() => {
  mongoConnection.getConnection.restore();
});

const payloadProduct = {
  name: "produto novo",
  quantity: 10,
}

// productModel tests
describe('products - recupera os valores do banco', async () => {
  it('retorna todos documentos', async () => {
    const addedProduct = await productsModel.addProduct(payloadProduct);
    const productsFromDB = await productsModel.getAll();

    expect(productsFromDB).to.deep.equal([{
      _id: ObjectId(addedProduct._id),
      name: "produto novo",
      quantity: 10,
    }])
  });

  it('retorna por name', async () => {
    const { _id: id, name } = await productsModel.addProduct(payloadProduct);
    const productsFromDB = await productsModel.getByName(name);
    expect(productsFromDB[1]).to.deep.equal({
      _id: ObjectId(id),
      name: "produto novo",
      quantity: 10,
    })
  });

});

describe('products - adiciona um novo produto', () => {
  it('retorna um objeto', async () => {
    const addedProduct = await productsModel.addProduct(payloadProduct);

    expect(addedProduct).to.be.a('object');
  });
  it('objeto retornado possui propriedade _id', async () => {
    const addedProduct = await productsModel.addProduct(payloadProduct);

    expect(addedProduct).to.have.a.property('_id');
  });
  it('deve existir um produto com o nome cadastrado', async () => {
    const { _id: productId } = await productsModel.addProduct(payloadProduct);

    const productFromDB = await productsModel.getById(productId);
    expect(productFromDB).to.deep.equal({
      _id: productId,
      ...payloadProduct,
    })
  });
});

describe('products - atualiza um produto', () => {
  it('retorna o produto atualizado', async () => {
    const product = await productsModel.addProduct(payloadProduct);

    const updatedProduct = await productsModel.updateProduct({
      id: product._id,
      name: 'produto mais novo ainda',
      quantity: 15,
    });

    expect(updatedProduct).to.deep.equal({
      _id: product._id,
      name: 'produto mais novo ainda',
      quantity: 15,
    });
  });

  it('o produto atualizado está no BD', async () => {
    const product = await productsModel.addProduct(payloadProduct);

    const updatedProduct = await productsModel.updateProduct({
      id: product._id,
      name: 'produto mais novo ainda',
      quantity: 15,
    });

    const productFromBD = await productsModel.getById(product._id);

    expect(productFromBD).to.deep.equal({
      _id: product._id,
      name: 'produto mais novo ainda',
      quantity: 15,
    });
  });
});

describe('products - atualiza a quantidade de um produto', () => {
  it('retorna o produto atualizado', async () => {
    const product = await productsModel.addProduct(payloadProduct);

    const updatedProduct = await productsModel.updateProductQty(product._id, 15);

    expect(updatedProduct).to.deep.equal({
      _id: product._id,
      quantity: 15,
    });
  });

  it('o produto com qty atualizada está no BD', async () => {
    const product = await productsModel.addProduct(payloadProduct);

    const updatedProduct = await productsModel.updateProductQty(product._id, 15);

    const productFromBD = await productsModel.getById(product._id);

    expect(productFromBD).to.deep.equal({
      _id: product._id,
      name: 'produto novo',
      quantity: 15,
    });
  });
});

describe('products - deleta um produto', () => {
  it('deleta um produto corretamente', async () => {
    const product = await productsModel.addProduct(payloadProduct);

    const deletedProduct = await productsModel.deleteProduct(product._id);

    expect(deletedProduct).to.have.property('_id');

    const productFromBD = await productsModel.getById(product._id);

    expect(productFromBD).to.be.undefined;
  })
});

// salesModel tests

describe('sales - recupera os valores do banco', () => {
  it('retorna todos documentos', async () => {
    const addedProduct = await productsModel.addProduct(payloadProduct);
    const addedSale = await salesModel.addSales([{
      productId: addedProduct._id,
      quantity: 5
    }]);
    const salesFromDB = await salesModel.getAll();

    expect(salesFromDB).to.deep.equal([{
      _id: ObjectId(addedSale._id),
      itensSold: [{
        productId: addedProduct._id,
        quantity: 5
      }]
    }])
  });
});

describe('sales - atualiza uma venda', () => {
  it('funciona corretamente', async () => {
    const addedProduct = await productsModel.addProduct(payloadProduct);
    const addedSale = await salesModel.addSales([{
      productId: addedProduct._id,
      quantity: 5
    }]);

    const updatedSale = await salesModel.updateSales({
      id: addedSale._id,
      productId: addedSale.itensSold.find((e) => e.productId === addedProduct._id).productId,
      quantity: 1,
    });

    const saleFromDB = await salesModel.getById(addedSale._id);

    expect(saleFromDB).to.deep.equal({
      _id: ObjectId(addedSale._id),
      itensSold: [{
        productId: addedProduct._id,
        quantity: 1
      }]
    })
  });
});

describe('sales - deleta uma venda', () => {
  it('deleta corretamente', async () => {
    const addedProduct = await productsModel.addProduct(payloadProduct);
    const addedSale = await salesModel.addSales([{
      productId: addedProduct._id,
      quantity: 5
    }]);

    await salesModel.deleteSales(addedSale._id);

    const saleFromDB = await salesModel.getById(addedSale._id);

    expect(saleFromDB).to.be.undefined;
  });
})
