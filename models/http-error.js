class HttpError extends Error {
  constructor(message, errorCode, errors = []) {
    super(message);
    this.code = errorCode;
    this.info = { errors };
  }
}

module.exports = HttpError;
