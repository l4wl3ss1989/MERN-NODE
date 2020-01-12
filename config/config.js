const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  PORT: process.env.PORT,
  MONGODB_USER: process.env.MONGODB_USER,
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
  MONGODB_DATABASE: process.env.MONGODB_DATABASE
};
