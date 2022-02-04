const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const { initialNotes, notesInDb } = require('./helpers')
const api = supertest(app)

beforeEach(async () => {
  await Note.deleteMany()

  const noteObjects = initialNotes.map((note) => new Note(note))
  const promiseArray = noteObjects.map((note) => note.save())
  await Promise.all(promiseArray)
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
test('all notes are returned', async () => {
  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
})
test('a note is about html', async () => {
  const notesAtTheEnd = await notesInDb()
  const contents = notesAtTheEnd.map((c) => c.content)
  expect(contents).toContain(initialNotes[0].content)
})
test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map((r) => r.content)
  expect(contents).toContain(initialNotes[1].content)
})

test('a valid note can be added', async () => {
  const content = 'async/await simplifies making async calls'
  const newNote = {
    content: content,
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtTheEnd = await notesInDb()
  expect(notesAtTheEnd).toHaveLength(initialNotes.length + 1)

  const contents = notesAtTheEnd.map((c) => c.content)

  expect(contents).toContain(content)
})
test('note without content can not be added', async () => {
  const newNote = {
    important: true
  }

  await api.post('/api/notes').send(newNote).expect(400)

  const notesAtTheEnd = await notesInDb()
  expect(notesAtTheEnd).toHaveLength(initialNotes.length)
})

test('a specific note can be viewed', async () => {
  const notesAtStart = await notesInDb()

  const noteToView = notesAtStart[0]

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

  expect(resultNote.body).toEqual(processedNoteToView)
})

test('fails with status code 400 id is invalid', async () => {
  const invalidId = '5a3d5da59070081a82a3445'

  await api.get(`/api/notes/${invalidId}`).expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})
