const express = require('express');
const { check } = require('express-validator');

const inputsValidate = require('../util/inputs-validate');
const { getUsers, createUser, loginUser } = require('../controllers/users.controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

const signupValidator = [
  check('name').isLength({ min: 2 }),
  check('email')
    .normalizeEmail()
    .isEmail(),
  check('password').isLength({ min: 6 })
];

router.get('/', getUsers);
router.post('/signup', fileUpload.single('image'), signupValidator, inputsValidate, createUser);
router.post('/login', loginUser);

module.exports = router;
