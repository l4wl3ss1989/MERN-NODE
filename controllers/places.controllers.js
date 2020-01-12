const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsFromAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

exports.getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('Somthing went wrong, could not find a place.', 500);
    return next(error);
  }
  // When working with async code throw will not work correctly use next() instead
  if (!place) {
    const error = new HttpError('Could not find a place for the provaided id.', 404);
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

exports.getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  // // let places;
  // try {
  //   places = await Place.find({ creator: userId });
  // } catch (err) {
  //   const error = new HttpError('Fetching places failed, please try again later', 500);
  //   return next(error);
  // }
  // const hasNoPlaces = !places || places.length === 0;
  // 💥 INITIAL ALTERNATIVE
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (err) {
    const error = new HttpError('Fetching places failed, please try again later', 500);
    return next(error);
  }
  const hasNoPlaces = !userWithPlaces || userWithPlaces.places.length === 0;
  if (hasNoPlaces)
    return next(new HttpError('Could not find places for the provaided user id.', 404));
  res.json({
    places: userWithPlaces.places.map(place => place.toObject({ getters: true }))
  });
};

exports.createPlace = async (req, res, next) => {
  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsFromAddress(address);
  } catch (err) {
    return next(err);
  }
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg',
    creator
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    return next(new HttpError('Creating place failed, please try again.', 500));
  }
  if (!user) return next(new HttpError('Could not find user for provaided id', 404));
  try {
    // https://www.udemy.com/course/react-nodejs-express-mongodb-the-mern-fullstack-guide/learn/lecture/16929128#questions
    // WARN 💥: Requires places collection allready been created.
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
    // Any error will rollback all changes on db.
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again.', 500);
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

exports.updatePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  const { title, description } = req.body;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('Somthing went wrong, could not update a place.', 500);
    return next(error);
  }
  if (!place) return next(new HttpError('Place NOT found.', 404));
  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError('Somthing went wrong, could not update place.', 500);
    return next(error);
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

exports.deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate('creator'); // acces external doc info by ref.
  } catch (err) {
    const error = new HttpError('Somthing went wrong, could not delete a place.', 500);
    return next(error);
  }
  if (!place) return next(new HttpError('Could not find a place for this id.', 404));
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place); // This will remove the place form the user
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
    // Any error will rollback all changes on db.
  } catch (err) {
    const error = new HttpError('Somthing went wrong, could not delete a place.', 500);
    return next(error);
  }
  res.status(204).json({ message: 'Deleted place.' });
};
