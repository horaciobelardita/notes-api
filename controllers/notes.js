const { Router } = require('express')
const Note = require('../models/note')

const notesRouter = Router()

notesRouter
  .route('/')
  .get((req, res) => {
    Note.find().then((notes) => {
      res.json(notes)
    })
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
    const note = new Note({
      content: req.body.content,
      important: req.body.important || false,
      date: new Date()
    })
    note.save().then((savedNote) => {
      res.status(201).json(savedNote)
    })
  })

notesRouter
  .route('/:id')
  .get((req, res, next) => {
    const id = req.params.id
    Note.findById(id)
      .then((foundedNote) => {
        if (!foundedNote) {
          return res.sendStatus(404)
        }
        res.json(foundedNote)
      })
      .catch((err) => next(err))
  })
  .delete((req, res, next) => {
    Note.findByIdAndRemove(req.params.id)
      .then((deletedNote) => {
        if (!deletedNote) {
          return res.sendStatus(404)
        }
        return res.sendStatus(204)
      })
      .catch((error) => next(error))
  })
  .put((req, res, next) => {
    const dataToUpdate = {
      content: req.body.content,
      important: req.body.important
    }
    Note.findByIdAndUpdate(req.params.id, dataToUpdate, {
      new: true,
      runValidators: true
    })
      .then((returnedNote) => {
        if (!returnedNote) {
          return res.sendStatus(404)
        }
        return res.json(returnedNote)
      })
      .catch((error) => next(error))
  })

module.exports = notesRouter
