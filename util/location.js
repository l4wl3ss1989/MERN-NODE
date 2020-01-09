const axios = require('axios');

const { GOOGLE_API_KEY } = require('../config/config');
const HttpError = require('../models/http-error');

// https://developers.google.com/maps/documentation/geocoding/start
const getCoordsFromAddress = async address => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${GOOGLE_API_KEY}`
  );

  const data = response.data;
  if (!data || data.status === 'ZERO_RESUTLS') {
    throw new HttpError('Could not find location for the especified address', 422);
  }
  //   console.log(data.results);
  const coordinates = data.results[0].geometry.location;
  return coordinates;
};

module.exports = getCoordsFromAddress;
