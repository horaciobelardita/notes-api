const mongoose = require('mongoose')
const { MONGODB_URI, MONGODB_URI_TEST } = require('./utils/config')

const connectionString =
  process.env.NODE_ENV === 'test' ? MONGODB_URI_TEST : MONGODB_URI

mongoose
  .connect(connectionString)
  .then(() => {
    console.log('database connected')
  })
  .catch(console.error)

process.on('uncaughtException', () => {
  mongoose.connection.close()
})
