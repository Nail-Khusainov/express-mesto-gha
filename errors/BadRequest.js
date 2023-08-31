/* eslint-disable linebreak-style */
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = BadRequestError;
