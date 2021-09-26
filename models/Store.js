const { ObjectId } = require('mongodb');
const connection = require('./connection');

const getAll = async () => 
  connection()
    .then((db) => db.collection('products').find().toArray());

const findByName = async (name) => {
  const product = await connection()
  .then((db) => db.collection('products').findOne({ name }));
  return product;
};
    
const findById = async (id) => {
  const product = await connection()
  .then((db) => db.collection('products').findOne(new ObjectId(id)));
  return product;
};

const deleteById = async (id) => {
  const product = await connection()
    .then((db) => db.collection('products')
      .deleteOne({ _id: ObjectId(id) }));
      return product;
}; 
const create = async (name, quantity) =>
  connection()
    .then((db) =>
      db.collection('products').insertOne({ name, quantity })).then((result) => result);

const updateById = async (name, quantity, id) =>
  connection()
    .then((db) =>
      db.collection('products').updateOne({ _id: new ObjectId(id) },
        { $set: { name, quantity } })).then((result) => result);

module.exports = {
  getAll,
  deleteById,
  updateById,
  findByName,
  findById,
  create,
};