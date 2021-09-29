const connection = require('./connection');
const { ObjectId } = require('mongodb');
//   expect(response).to.
const register = async (name, quantity) => {
  const db = await connection();
  const products = await db.collection('products')
    .insertOne({
      name,
      quantity,
    });
  return (products.ops[0]);
};

const listAll = async () => {
  const db = await connection();
  const result = await db.collection('products')
    .find()
    .toArray();
  return ({ products: result });
};

const findOne = async (id, name) => {
  const db = await connection();
  const result = await db.collection('products')
    .findOne({
      $or: [
        {_id: ObjectId(id) },
        { name },
      ],
    });
  return result;
};

const updateOne = async (id, name, quantity) => {
  const db = await connection();
  await db.collection('products')
    .updateOne(
      { _id: ObjectId(id) },
      { $set: {
        name,
        quantity,
      } }
    );
  return {
    id,
    name,
    quantity,
  };
};

const deleteOne = async (id) => {
  const db = await connection();
  await db.collection('products')
    .deleteOne({ _id: ObjectId(id) });
  return;
};

module.exports = {
  register,
  listAll,
  findOne,
  updateOne,
  deleteOne
};