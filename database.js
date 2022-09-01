const { MongoClient } = require("mongodb");
require('dotenv').config()


const client = new MongoClient(process.env.MONGO_URL);

const db = client.db(process.env.MONGO_DB)

module.exports = { client, db }

