const unknownEndpoint = (req, res) => {
  return res.status(404).send({ error: 'unknown endpoint' })
}
module.exports = unknownEndpoint
