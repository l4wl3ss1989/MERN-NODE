class HttpError extends Error {
  constructor(message, errorCode, errors = []) {
    super(message);
    this.code = errorCode;
    this.data = errors;
  }
}

module.exports = HttpError;
