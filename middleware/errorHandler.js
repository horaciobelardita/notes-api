const errorHandler = (error, req, res, next) => {
  console.log(
    '🚀 ~ file: errorHandler.js ~ line 16 ~ errorHandler ~ error',
    JSON.stringify(error, null, 2)
  )

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' })
  }
  if (error.name === 'MongoServerError') {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: `${Object.keys(error.keyPattern)[0]} to be unique` })
    }
  }
  return res.sendStatus(500)
}

module.exports = errorHandler
