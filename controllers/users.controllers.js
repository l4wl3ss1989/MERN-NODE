const uuid = require('uuid/v4');

const HttpError = require('../models/http-error');
const { DUMMY_USERS } = require('../dummy/dummy');

exports.getUsers = (req, res, next) => {
  res.json(DUMMY_USERS);
};

exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  const emailExists = DUMMY_USERS.find(user => user.email === email);
  if (emailExists) throw new HttpError('Could not create user, email allready exists', 422);
  const createdUser = {
    id: uuid,
    name,
    email,
    password
  };
  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
};

exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find(user => user.email === email);
  if (!identifiedUser || identifiedUser.password !== password)
    throw new HttpError('Could not Identify user, credentials seem to be wrong', 401);
  res.json({ message: 'Logged in' });
};
