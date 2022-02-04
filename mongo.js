const mongoose = require('mongoose')

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log('database connected')
  })
  .catch(console.error)
