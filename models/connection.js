const { MongoClient } = require('mongodb');
//   expect(response).to.
const DB_NAME = 'StoreManager';
const MONGO_DB_URL = `mongodb://mongodb:27017/${DB_NAME}`;
// const MONGO_DB_URL = 'mongodb://localhost:27017/${DB_NAME}';

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let db = null;

const connection = () => {
  return db
    ? Promise.resolve(db)
    : MongoClient.connect(MONGO_DB_URL, OPTIONS)
      .then((conn) => {
        db = conn.db(DB_NAME);
        return db;
      });
};

module.exports = connection;