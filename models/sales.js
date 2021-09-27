const { ObjectId } = require('mongodb');
const connection = require('./connection');

const getAll = async () =>
  connection()
    .then((db) => db.collection('sales').find().toArray());

 const findByName = async (name) => {
     const result = await connection()
    .then((db) => db.collection('products').findOne({ name }));
    return result;
 };

const findById = async (id) => {
    const result = await connection()
    .then((db) => db.collection('sales').findOne(new ObjectId(id)));
    return result;
};
const deleteById = async (id) => {
    const result = await connection()
    .then((db) => db.collection('sales')
      .deleteOne({ _id: ObjectId(id) }));
    return result;
};
const create = async (itensSold) =>
  connection()
    .then((db) =>
      db.collection('sales').insertOne(itensSold)).then((result) => result);

const updateById = async (quantity, id, index) =>
  connection()
    .then((db) =>
      db.collection('sales').updateOne({ _id: new ObjectId(id),
      },
      { $set: { [`itensSold.${index}.quantity`]: quantity } })).then((result) => result);

module.exports = {
  getAll,
  deleteById,
  updateById,
  findByName,
  findById,
  create,
};