const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  PORT: process.env.PORT
};
