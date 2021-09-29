const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const ProductsModel = require('../../models/productsModel');
const SalesModel = require('../../models/salesModel');

const ID_INVALIDO = 99999;

const NOME_PRODUTO_1 = 'Produto 1';
const QUANTIDADE_PRODUTO_1 = '10';

const NOME_PRODUTO_2 = 'Produto 2';
const QUANTIDADE_PRODUTO_2 = '100';

describe('Testes: Camada Models - Products', () => {
  before(async() => {
    const DBServer = new MongoMemoryServer();
    const URLMock = await DBServer.getUri();

    const connectionMock = await MongoClient
      .connect(URLMock, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => { MongoClient.connect.restore() });

  it('Registra um novo produto e retorna um objeto com as propriedades "_id", "name" e "quantity" do produto registrado', async () => {
    const resposta = await ProductsModel.register(NOME_PRODUTO_1, QUANTIDADE_PRODUTO_1);
    expect(resposta).to.be.a('object');
    expect(resposta).to.include.all.keys('_id', 'name', 'quantity');
  });

  it('Retorna todos os produtos registrados em um objeto com a propriedade "products" contendo um array de objetos, cada um referente a um dos produtos registrados e contendo as propriedades "_id", "name" e "quantity" do produto', async () => {
    await ProductsModel.register(NOME_PRODUTO_1, QUANTIDADE_PRODUTO_1);
    await ProductsModel.register(NOME_PRODUTO_2, QUANTIDADE_PRODUTO_2);
    const resposta = await ProductsModel.listAll();
    expect(resposta).to.be.an('object');
    expect(resposta).to.have.a.property('products');
    expect(resposta.products).to.be.an('array');
    expect(resposta.products[0]).to.be.an('object');
    expect(resposta.products[0]).to.include.all.keys('_id', 'name', 'quantity');
  });

  describe('Procura um produto pelo id ou pelo nome', () => {
    it('quando não encontra uma correspondência, retorna "null"', async () => {
      const respostaNome = await ProductsModel.findOne(null, 'NOME_PRODUTO_3');
      expect(respostaNome).to.be.null;
    });

    it('quando encontra uma correspondência, retorna um objeto com as propriedades: "_id", "name" e "quantity" do produto', async () => {
      await ProductsModel.register(NOME_PRODUTO_1, QUANTIDADE_PRODUTO_1);
      const resposta = await ProductsModel.findOne(null, NOME_PRODUTO_1);
      expect(resposta).to.be.a('object');
      expect(resposta).to.include.all.keys('_id', 'name', 'quantity');
    });
  });

  it('Atualiza um produto pelo id e retorna um objeto com as propriedades "id", "name" e "quantity" do produto atualizado', async () => {
    const productToUpdate = await ProductsModel.register(NOME_PRODUTO_1, QUANTIDADE_PRODUTO_1);
    const resposta = await ProductsModel.updateOne(productToUpdate._id, NOME_PRODUTO_2, QUANTIDADE_PRODUTO_2);
    expect(resposta).to.be.a('object');
    expect(resposta).to.include.all.keys('id', 'name', 'quantity');
  });

  it('Deleta um produto pelo id', async () => {
    const productToDelete = await ProductsModel.register(NOME_PRODUTO_1, QUANTIDADE_PRODUTO_1);
    const resposta = await ProductsModel.deleteOne(productToDelete._id);
    expect(resposta).to.be.undefined;
  });
});

describe('Testes: Camada Models - Sales', () => {
  before(async() => {
    const DBServer = new MongoMemoryServer();
    const URLMock = await DBServer.getUri();

    const connectionMock = await MongoClient
      .connect(URLMock, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => { MongoClient.connect.restore() });

  it('Registra uma nova venda, atualiza as quantidades dos produtos e retorna um objeto com as propriedades "_id" e "itensSold" da venda', async () => {
    const produto1 = await ProductsModel.register(NOME_PRODUTO_1, QUANTIDADE_PRODUTO_1);
    const produto2 = await ProductsModel.register(NOME_PRODUTO_2, QUANTIDADE_PRODUTO_2);

    const VENDA_1 = [
      {
        productId: produto1._id.ObjectId,
        quantity: 1,
      },
      {
        productId: produto2._id.ObjectId,
        quantity: 10,
      },
    ];

    const resposta = await SalesModel.register(VENDA_1);
    expect(resposta).to.be.a('object');
    expect(resposta).to.include.all.keys('_id', 'itensSold');
  });

  it('Retorna todas as vendas realizadas em um objeto com a propriedade "sales" contendo um array de objetos, cada uma das vendas realizadas e contendo as propriedades "_id" e "itensSold" da venda', async () => {
    const produto1 = await ProductsModel.register(NOME_PRODUTO_1, QUANTIDADE_PRODUTO_1);
    const produto2 = await ProductsModel.register(NOME_PRODUTO_2, QUANTIDADE_PRODUTO_2);

    const VENDA_1 = [
      {
        productId: produto1._id.ObjectId,
        quantity: 1,
      },
      {
        productId: produto2._id.ObjectId,
        quantity: 10,
      },
    ];

    const VENDA_2 = [
      {
        productId: produto1._id.ObjectId,
        quantity: 5,
      },
      {
        productId: produto2._id.ObjectId,
        quantity: 500,
      },
    ];

    await SalesModel.register(VENDA_1);
    await SalesModel.register(VENDA_2);
    const resposta = await SalesModel.listAll();
    expect(resposta).to.be.an('object');
    expect(resposta).to.have.a.property('sales');
    expect(resposta.sales).to.be.an('array');
    expect(resposta.sales[0]).to.be.an('object');
    expect(resposta.sales[0]).to.include.all.keys('_id', 'itensSold');
  });

  describe('Procura uma venda pelo id', () => {
    it('quando não encontra uma correspondência, retorna "null"', async () => {
      const resposta = await SalesModel.findOne(ID_INVALIDO);
      expect(resposta).to.be.null;
    });

    it('quando encontra uma correspondência, retorna um objeto com as propriedades "_id" e "itensSold" da venda', async () => {
      const produto1 = await ProductsModel.register(NOME_PRODUTO_1, QUANTIDADE_PRODUTO_1);
      const produto2 = await ProductsModel.register(NOME_PRODUTO_2, QUANTIDADE_PRODUTO_2);

      const VENDA_1 = [
        {
          productId: produto1._id.ObjectId,
          quantity: 1,
        },
        {
          productId: produto2._id.ObjectId,
          quantity: 10,
        },
      ];

      const vendaAEncontrar = await SalesModel.register(VENDA_1);
      const resposta = await SalesModel.findOne(vendaAEncontrar._id);
      expect(resposta).to.be.a('object');
      expect(resposta).to.include.all.keys('_id', 'itensSold');
    });
  });

  it('Atualiza uma venda pelo id e retorna um objeto com as propriedades "_id" e "itensSold" da venda', async () => {
    const produto1 = await ProductsModel.register(NOME_PRODUTO_1, QUANTIDADE_PRODUTO_1);
    const produto2 = await ProductsModel.register(NOME_PRODUTO_2, QUANTIDADE_PRODUTO_2);

    const VENDA_1 = [
      {
        productId: produto1._id.ObjectId,
        quantity: 1,
      },
      {
        productId: produto2._id.ObjectId,
        quantity: 10,
      },
    ];

    const VENDA_2 = [
      {
        productId: produto1._id.ObjectId,
        quantity: 5,
      },
      {
        productId: produto2._id.ObjectId,
        quantity: 500,
      },
    ];

    const vendaAAtualizar = await SalesModel.register(VENDA_1);
    const resposta = await SalesModel.updateOne(vendaAAtualizar._id, VENDA_2);
    expect(resposta).to.be.a('object');
    expect(resposta).to.include.all.keys('_id', 'itensSold');
  });

  it('Deleta uma venda pelo id e em seguida atualiza as quantidades dos produtos, segundo a venda cancelada', async () => {
    const produto1 = await ProductsModel.register(NOME_PRODUTO_1, QUANTIDADE_PRODUTO_1);
    const produto2 = await ProductsModel.register(NOME_PRODUTO_2, QUANTIDADE_PRODUTO_2);

    const VENDA_1 = [
      {
        productId: produto1._id.ObjectId,
        quantity: 1,
      },
      {
        productId: produto2._id.ObjectId,
        quantity: 10,
      },
    ];

    const vendaADeletar = await SalesModel.register(VENDA_1);
    const resposta = await SalesModel.deleteOne(vendaADeletar._id);
    expect(resposta).to.be.undefined;
  });
});