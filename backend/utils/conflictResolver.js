function lastWriteWins(local, server) {
  if (!local) return server
  if (!server) return local
  return new Date(local.updatedAt) > new Date(server.updatedAt) ? local : server
}

module.exports = { lastWriteWins }
