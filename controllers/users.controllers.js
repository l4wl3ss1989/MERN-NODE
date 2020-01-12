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
  if (existingUser)
    return next(new HttpError('User exists already, please login instead.', 422));
  const createdUser = new User({
    name,
    email,
    image:
      'https://accounts.google.com/SignOutOptions?hl=en&amp;continue=https://www.google.com%3Fhl%3Den-US',
    password,
    places: []
  });
  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError('Signing up failed, please try again.', 500));
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError('Logging in failed please try again later', 500));
  }
  if (!existingUser || existingUser.password !== password)
    return next(new HttpError('Invalid credentials, could not log you in.', 401));
  res.json({ message: 'Logged in!' });
};
