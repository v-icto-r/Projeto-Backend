const { ObjectId } = require('mongodb');
const mongoConnection = require('./connection');

async function getAll() {
  const db = await mongoConnection.getConnection();
  const products = await db.collection('products').find().toArray();

  return products;
}

async function getByName(name) {
  const db = await mongoConnection.getConnection();
  const productsByName = await db
  .collection('products')
  .find({ name }, {})
  .toArray();

  return productsByName;
}

async function getById(id) {
  if (!ObjectId.isValid(id)) return null;

  const db = await mongoConnection.getConnection();
  const productsById = await db
  .collection('products')
  .find({ _id: ObjectId(id) })
  .toArray();

  return productsById[0];
}

async function addProduct({ name, quantity }) {
  const db = await mongoConnection.getConnection();
  const { insertedId: _id } = await db.collection('products').insertOne(
    { name, quantity },
  );

  return {
    _id,
    name,
    quantity,
  };
}

async function updateProduct({ id, name, quantity }) {
  if (!ObjectId.isValid(id)) return null;

  const db = await mongoConnection.getConnection();
  await db.collection('products').updateOne(
    { _id: ObjectId(id) },
    { $set: { name, quantity } },
  );

  return {
    _id: id,
    name,
    quantity,
  };
}

async function updateProductQty(id, quantity) {
  if (!ObjectId.isValid(id)) return null;

  const db = await mongoConnection.getConnection();
  await db.collection('products').updateOne(
    { _id: ObjectId(id) },
    { $set: { quantity } },
  );

  return {
    _id: id,
    quantity,
  };
}

async function deleteProduct(id) {
  if (!ObjectId.isValid(id)) return null;

  const db = await mongoConnection.getConnection();
  await db.collection('products').deleteOne(
    { _id: ObjectId(id) },
  );

  return { _id: ObjectId(id) };
}

module.exports = {
  getAll,
  getByName,
  getById,
  addProduct,
  updateProduct,
  updateProductQty,
  deleteProduct,
};
