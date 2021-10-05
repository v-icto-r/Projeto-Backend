const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://mongodb:27017';

let schema = null;

async function getConnection() {
  if (schema) return Promise.resolve(schema);
  return MongoClient.connect(
    MONGODB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
    .then((conn) => {
      schema = conn.db('StoreManager');
      return schema;
    })
    .catch((err) => console.error(err));
}

module.exports = { getConnection };
