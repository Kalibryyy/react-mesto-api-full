class DisconnectedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 503;
  }
}

module.exports = DisconnectedError;
