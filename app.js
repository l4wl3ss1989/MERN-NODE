const express = require('express');
const bodyParser = require('body-parser');

const { PORT } = require('./config/config');
const HttpError = require('./models/http-error');
const placesRoutes = require('./routes/places.routes');
const userRoutes = require('./routes/users.routes');

const app = express();

// Midddleware
app.use(bodyParser.json());

// Routing
app.use('/api/places', placesRoutes);
app.use('/api/users', userRoutes);

// No route found
app.use((req, res, next) => {
  throw new HttpError('Could not find this route', 404);
});

/* Default error handling (special middleware function provaided by express)
 * requires throw Error */
app.use((error, req, res, next) => {
  const responseHasBeingSend = res.headerSend;
  if (responseHasBeingSend) next(error);
  const { code, message } = error;
  res.status(code || 500).json({ message: message || 'An unknown error ocurred' });
});

app.listen(PORT, () => console.log(`Listening to PORT: ${PORT}`));
