const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const { SECRET } = require('../config/config');

module.exports = (req, res, next) => {
  try {
    const [, token] = req.headers.authorization.split(' '); // Authorization: 'Bearer TOKEN'
    if (!token) return next(new HttpError('Authentication failed.', 403));
    const { userId } = jwt.verify(token, SECRET); // Can throw
    req.userData = { userId };
    next();
  } catch (err) {
    return next(new HttpError('Authentication failed.', 403));
  }
};
