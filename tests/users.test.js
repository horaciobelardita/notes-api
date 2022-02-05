const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const { usersInDb } = require('./helpers')
const api = supertest(app)

describe('create a new user', () => {
  beforeEach(async () => {
    await User.deleteMany()
    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User({
      passwordHash,
      name: 'test123',
      username: 'test123'
    })
    await user.save()
  })
  test('a valid user can be added', async () => {
    const usersAtStart = await usersInDb()
    const newUser = { name: 'test', username: 'test', password: '1234' }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper status code and message if username already taken', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'test123',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username to be unique')

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})
