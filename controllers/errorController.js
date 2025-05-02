const AppError = require('../utils/appError');

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (error) => {
  if (!error.keyValue) {
    return new AppError('Duplicate field error, but keyValue is missing.', 400);
  }

  // Extract the duplicate field name and value
  const field = Object.keys(error.keyValue)[0]; // e.g., "email"
  const value = error.keyValue[field]; // e.g., "test@example.com"

  const message = `Duplicate field value: "${value}". Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (er) => {
  return new AppError('Invalid token. Please log in again!', 401); //unauthorized
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired! Please log in again', 401);
};

const sendErrorDev = (error, req, res) => {
  //A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack,
    });
  }

  //B) RENDERED WEBSITE
  console.error('ERROR 💥', error);
  return res.status(error.statusCode).render('error', {
    title: 'Something went wrong',
    msg: error.message,
  });
};

const sendErrorProd = (error, req, res) => {
  // API ERRORS
  if (req.originalUrl.startsWith('/api')) {
    // Operational error - return details to client
    if (error.isOperational) {
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    }

    // Unknown error - log and return generic response
    console.error('ERROR 💥', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // RENDERED PAGE ERRORS
  // Operational error - show error page
  if (error.isOperational) {
    console.log(error);

    return res.status(error.statusCode).render('error', {
      title: 'Something went wrong',
      msg: error.message,
    });
  }

  // Unknown error - log and show generic page
  console.error('ERROR 💥', error);
  return res.status(500).render('error', {
    title: 'Something went wrong',
    msg: 'Please Try Again Later',
  });
};

module.exports = (error, req, res, next) => {
  //   console.log(error.stack);

  //if it has 4 parameters its recognized as error handler middleware
  error.statusCode = error.statusCode || 500; //500 means external server error
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let err = { ...error };
    let err = JSON.parse(JSON.stringify(error));
    err.message = error.message;
    // let err = Object.create(error); // keeps prototype chain || chatGPT recom..

    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldDB(err);
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') err = handleJWTError();
    if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();

    //duplicate error
    if (err.code === 11000 && err.keyPattern?.tour && err.keyPattern?.user) {
      return new AppError(
        'You have already submitted a review for this tour.',
        400
      );
    }

    sendErrorProd(err, req, res);
  }
};
