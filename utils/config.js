require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGO_DB_URI
const MONGODB_URI_TEST = process.env.MONGO_DB_URI_TEST

module.exports = {
  MONGODB_URI,
  PORT,
  MONGODB_URI_TEST
}
