const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { SECRET } = require('../config/config');
const HttpError = require('../models/http-error');
const User = require('../models/user');

exports.getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    return next(new HttpError('Fetching users failed, please try again later.', 500));
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

exports.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError('Signing up failed please try again later', 500));
  }
  if (existingUser) return next(new HttpError('User exists already, please login instead.', 422));
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    next(new HttpError('Could not create user, please try again.', 500));
  }
  const createdUser = new User({
    name,
    email,
    image: req.file.path.replace(/\\/g, '/'), // WARN 💥: Windows Issue
    password: hashedPassword,
    places: []
  });
  try {
    await createdUser.save();
    const { id: createdId, email: createdEmail } = createdUser;
    const token = await jwt.sign({ userId: createdUser.id, email: createdUser.email }, SECRET, {
      expiresIn: '1h'
    });
    res.status(201).json({ userId: createdId, email: createdEmail, token });
  } catch (err) {
    return next(new HttpError('Signing up failed, please try again.', 500));
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return next(new HttpError('Invalid credentials, could not log you in.', 403));
    const isValidPassowrd = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassowrd)
      return next(new HttpError('Invalid credentials, could not log you in.', 403));

    const { id: existingUserId, email: existingUserEmail } = existingUser;
    const token = await jwt.sign({ userId: existingUserId, email: existingUserEmail }, SECRET, {
      expiresIn: '1h'
    });
    // res.json({ message: 'Logged in!', user: existingUser.toObject({ getters: true }) });
    res.json({ userId: existingUserId, email: existingUserEmail, token });
  } catch (err) {
    return next(new HttpError('Logging in failed please try again later', 500));
  }
};
