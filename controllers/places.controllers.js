const uuid = require('uuid/v4');

const HttpError = require('../models/http-error');
let { DUMMY_PLACES } = require('../dummy/dummy');

exports.getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find(p => p.id === placeId);
  if (!place) throw new HttpError('Could not find a place for the provaided id.', 404);
  res.json({ place });
};

exports.getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter(p => p.creator === userId);
  const hasNoPlaces = !palces || places.length === 0;
  if (hasNoPlaces)
    return next(new HttpError('Could not find places for the provaided user id.', 404));
  res.json({ places });
};

exports.createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator
  };
  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};

exports.updatePlace = (req, res, next) => {
  const placeId = req.params.pid;
  const { title, description } = req.body;
  const placeExists = DUMMY_PLACES.find(p => p.id === placeId);
  if (!placeExists) throw new HttpError('Place NOT found.', 404);
  const updatedPlace = {
    ...placeExists,
    title,
    description
  };
  DUMMY_PLACES[placeId] = updatedPlace;
  res.status(200).json({ place: updatedPlace });
};

exports.deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  const placeExists = DUMMY_PLACES.find(p => p.id === placeId);
  if (!placeExists) throw new HttpError('Place NOT found.', 404);
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
  res.status(204).json({ message: 'Deleted place.' });
};
