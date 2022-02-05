const bcrypt = require('bcrypt')
const { Router } = require('express')
const User = require('../models/user')
const usersRouter = Router()
usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find().populate('notes', {
      content: 1,
      date: 1,
      important: 1
    })
    return res.json(users)
  } catch (error) {
    next(error)
  }
})
usersRouter.post('/', async (req, res, next) => {
  const validFields = ['username', 'name', 'password']
  const keys = Object.keys(req.body)
  const isValid = validFields.every((field) => keys.includes(field))
  if (!isValid) {
    return res.status(400).json({
      error: `missing required fields (${validFields.join(',')})`
    })
  }
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10)
    const newUser = {
      username: req.body.username,
      name: req.body.name,
      passwordHash
    }
    const savedUser = await User.create(newUser)
    return res.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
