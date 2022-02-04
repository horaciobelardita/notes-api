const app = require('./app')
const { PORT } = require('./utils/config')

const server = app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
module.exports = server
