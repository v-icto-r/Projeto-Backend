const { ObjectId } = require('mongodb');
const mongoConnection = require('./connection');

async function getAll() {
  const db = await mongoConnection.getConnection();

  const sales = await db.collection('sales').find().toArray();

  return sales;
}

async function getById(id) {
  if (!ObjectId.isValid(id)) return null;

  const db = await mongoConnection.getConnection();
  const saleById = await db
  .collection('sales')
  .find({ _id: ObjectId(id) })
  .toArray();

  return saleById[0];
}

async function addSales(salesList) {
  const db = await mongoConnection.getConnection();
  const { insertedId: _id } = await db.collection('sales').insertOne(
    { itensSold: salesList },
  );

  return {
    _id,
    itensSold: salesList,
  };
}

async function updateSales({ id, productId, quantity }) {
  if (!ObjectId.isValid(id)) return null;

  const db = await mongoConnection.getConnection();
  await db.collection('sales').updateOne(
    { _id: ObjectId(id) },
    { $set: { 'itensSold.$[sale].quantity': quantity } },
    { arrayFilters: [{ 'sale.productId': productId }] },
  );

  return {
    _id: id,
    itensSold: [{ productId, quantity }],
  };
}

async function deleteSales(id) {
  if (!ObjectId.isValid(id)) return null;

  const db = await mongoConnection.getConnection();
  const deletedSale = await db.collection('sales').deleteOne(
    { _id: ObjectId(id) },
  );

  return deletedSale;
}

module.exports = {
  getAll,
  getById,
  addSales,
  updateSales,
  deleteSales,
};
