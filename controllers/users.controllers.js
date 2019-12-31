const uuid = require('uuid/v4');

const { DUMMY_USERS } = require('../dummy/dummy');

exports.getUsers = (req, res, next) => {
  res.json(DUMMY_USERS);
};

exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
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
  res.status(200).json({ message: 'User Logged in' });
};
