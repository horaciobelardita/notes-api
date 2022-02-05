const { Router } = require('express')
const Note = require('../models/note')
const User = require('../models/user')

const notesRouter = Router()

notesRouter
  .route('/')
  .get((req, res) => {
    Note.find()
      .populate('user', { name: 1, username: 1 })
      .then((notes) => {
        res.json(notes)
      })
  })

  .post(async (req, res, next) => {
    const validFields = ['content', 'userId']
    const keys = Object.keys(req.body)
    const isValid = validFields.every((field) => keys.includes(field))
    if (!isValid) {
      return res.status(400).json({
        error: `missing required fields (${validFields.join(',')})`
      })
    }

    try {
      const user = await User.findById(req.body.userId)
      // if (!user) {
      //   throw new Error('User not found')
      // }
      const note = new Note({
        content: req.body.content,
        important: req.body.important || false,
        date: new Date(),
        user: user._id
      })
      const savedNote = await note.save()
      user.notes = [...user.notes, savedNote._id]
      await user.save()
      return res.status(201).json(savedNote)
    } catch (error) {
      next(error)
    }
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
