const express = require('express')
const cors = require('cors')
require('./mongo')
const unknownEndpoint = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')
const requestLogger = require('./middleware/requestLogger')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const app = express()

app.use(cors())
app.use(express.json())

app.use(requestLogger)

app.get('/', (req, res) => {
  return res.send('<h1>Hello World!</h1>')
})
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use(unknownEndpoint)

app.use(errorHandler)

module.exports = app
