const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const sanitizeHtml = require('sanitize-html');
const hpp = require('hpp');

// we only install this in after M V architecture
const cookieParser = require('cookie-parser');

const globalErrorHandler = require('./controllers/errorController');
const appError = require('./utils/appError');
const tourRouter = require('./routes/toursRoute');
const userRouter = require('./routes/usersRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

// START EXPRESS APP
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));

// 1) GLOBAL MIDDLEWARE

//SErving static files
app.use(express.static(path.join(__dirname, './public'))); // load static file without routes

// SET Security HTTP headers
// helmet is order sensitive must be on top
// Further HELMET configuration for Security Policy (CSP)
const scriptSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://cdnjs.cloudflare.com/',
];
const styleSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://fonts.googleapis.com/',
];
const connectSrcUrls = ['https://unpkg.com', 'https://tile.openstreetmap.org'];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// console.log(process.env.NODE_ENV);

//DEVELOPMENT  logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// LIMIT request from same APPI
//how many request per IP || for Denial of Service and Brute Force
const limiter = rateLimit({
  // 100 req per hr || output in header postman
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, Pleae try again in an hour',
});
app.use('/api', limiter);

// Data Sanitization against NoSQL query injection || clean req and res
app.use(mongoSanitize());

// Body parser, reading data form body into req.body
app.use(express.json({ limit: '10kb' })); //this is middleware || function to modify request data || request goes to
app.use(cookieParser());

// Data sanitization against XSS || clean user input
//jonas use app.use(xss()) | npm i xss-clean
app.use((req, res, next) => {
  const fieldsToSanitize = ['name', 'email'];

  for (let key of fieldsToSanitize) {
    if (req.body[key]) {
      req.body[key] = sanitizeHtml(req.body[key], {
        allowedTags: [],
        allowedAttributes: {},
      });
    }
  }
  next();
});

// Prevent parameter polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  //this will only work after | npm i cookie-parser
  // for each request we will display all cookies in the console
  // console.log(req.cookies);

  next();
});

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 2) ROUTES
//pug
app.use('/', viewRouter);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new appError(`Cant find ${req.originalUrl}`, 400));
});

app.use(globalErrorHandler);

module.exports = app;
