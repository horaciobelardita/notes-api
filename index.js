const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

function generateId() {
  return notes.length > 0 ? Math.max(...notes.map((note) => note.id)) + 1 : 1
}

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

app.get('/', (req, res) => {
  return res.send('<h1>Hello World!</h1>')
})

app
  .route('/api/notes')
  .get((req, res) => {
    return res.json(notes)
  })

  .post((req, res) => {
    const validFields = ['content']
    const keys = Object.keys(req.body)
    const isValid = validFields.every((field) => keys.includes(field))
    if (!isValid) {
      return res.status(400).json({
        error: `missing required fields (${validFields.join(',')})`
      })
    }
    const id = generateId()
    const note = {
      id,
      important: false,
      date: new Date().toISOString(),
      ...req.body
    }
    notes = [...notes, note]
    return res.status(201).json(note)
  })

app
  .route('/api/notes/:id')
  .get((req, res) => {
    const id = +req.params.id
    const note = notes.find((note) => note.id === id)
    if (!note) {
      return res.sendStatus(404)
    }
    return res.json(note)
  })
  .delete((req, res) => {
    const id = +req.params.id
    const noteIndex = notes.findIndex((note) => note.id === id)
    if (noteIndex === -1) {
      return res.sendStatus(404)
    }
    notes.splice(noteIndex, 1)
    return res.sendStatus(204)
  })

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
