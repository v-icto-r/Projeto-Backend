const connection = require('./connection');
const { ObjectId } = require('mongodb');
const zero = 0;

const register = async (itens) => {
  const itensSold = itens;
  const db = await connection();
  const sales = await db.collection('sales').insertOne({ itensSold })
    .then((result) => ({ _id: result.insertedId, itensSold }));

  for (let index = zero; index < itens.length; index++) {
    const saleProduct = itens[index];
    await db.collection('products')
      .updateOne(
        { _id: ObjectId(saleProduct.productId) },
        { $inc: { quantity: -saleProduct.quantity } },
      );
  }
  return sales;
};

const listAll = async () => {
  const db = await connection();
  const result = await db.collection('sales')
    .find()
    .toArray();
  return { sales: result };
};

const findOne = async (id) => {
  const db = await connection();
  const result = db.collection('sales')
    .findOne({ _id: ObjectId(id) });
  return result;
};

const updateOne = async (id, itens) => {
  const db = await connection();
  await db.collection('sales').updateOne(
    { _id: ObjectId(id) },
    { $set: { itensSold: itens } }
  );
  return ({
    _id: ObjectId(id),
    itensSold: itens,
  });
};

const deleteOne = async (id) => {
  const db = await connection();
  const sales = await db.collection('sales')
    .findOne({ _id: ObjectId(id) });
  await db.collection('sales')
    .deleteOne({ _id: ObjectId(id) });

  for (let index = zero; index < sales.itensSold.length; index++) {
    const saleProduct = sales.itensSold[index];
    await db.collection('products')
      .updateOne(
        { _id: ObjectId(saleProduct.productId) },
        { $inc: { quantity: saleProduct.quantity } },
      );
  }
  return;
};

module.exports = {
  register,
  listAll,
  findOne,
  updateOne,
  deleteOne
};