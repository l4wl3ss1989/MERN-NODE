const { validationResult } = require('express-validator');

const validateErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({
      message: 'Invalid inputs passed, please check your data.',
      errors: errors.array()
    });
  next();
};

module.exports = validateErrors;
