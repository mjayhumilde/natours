// const util = require('util') || or destructure
const { promisify } = require('util');
//
const crypto = require('crypto');
const User = require('../models/userModels');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // prevent XSS attacks || recieve and store and send it
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; //will be send in encrypted in https || will only activate in https

  res.cookie('jwt', token, cookieOptions);

  // remove the password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  //we use this approach because anyone can be admin if we dont use this
  //they can no longer add a role this is the fix || we can just add role in compass/mongoDB
  //we can also create a new route for creating admin but its too much here
  const newUser = await User.create({
    //We also have User.save
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
    passwordResetToken: req.body.passwordResetToken,
    passwordResetExpires: req.body.passwordResetExpires,
    active: req.body.active,
  });

  const url = `${req.protocol}://${req.get('host')}/me`;
  console.log(url);

  await new Email(newUser, url).sendWelcome();

  //npm i jsonwebtoken
  //implementing when user signup they stay log in anytime they visit the website
  //we stored the JWT_SECRET so its not exposed || read docs to understand if forgoten
  // you can also use jwt.io debuggger and paste the token to confirm
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1)check if email and password exist
  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }
  if (typeof email !== 'string' || typeof password !== 'string') {
    return next(new AppError('Invalid input data', 400));
  }

  //2) check if the user exist && password is correct
  //since password is hidden we need to select "+"password to bring it back to output
  const user = await User.findOne({ email: email }).select('+password');
  //user is from userDocument and correctpassword is an instance in userModel
  if (!user || !(await user.correctPassword(password, user.password))) {
    //this is security approact to the attacker dont know if email is wrong or password
    return next(new AppError('Incorrect email or password', 401)); //401 unauthorized
  }

  //3) if everthing ok, send the token to the client
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 1), // Expires in 10 seconds
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  //1)Getting token and check if its exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not log in! Please log in to get access.', 401)
    ); //unauthorized = 401
  }

  //2)Verification Token
  //promisify will return a promise ||  Tool to convert callback-style functions to Promises
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  //3)Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    );

  //4)Check if user changed password after the token was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  //GRANT ACCESS TO PROTECTED ROUTE
  //req is the data that travel from middleware to middleware
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// only for rendered pages, no errors!
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    //1) verify the token
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    // console.log(decoded);

    //2)Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return next();

    //3)Check if user changed password after the token was issued
    if (currentUser.changePasswordAfter(decoded.iat)) {
      return next();
    }

    // THERE IS A LOGGED IN USER
    res.locals.user = currentUser; // all pug will have access to user

    return next();
  }
  // THERE IS NO A LOGGED IN USER
  next();
});

//passing argument to middleware coming from tourRoutes
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is an array [admin, lead-guide]. if role=user === not have permission
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permissin to perform this action'),
        403
      ); //403 is forbidden
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on POSTED email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('Theres is no user with email address', 404)); //notofound
  }

  //2) Generate the random token
  const resetToken = user.createPasswordResetToken();
  //we need to save it || in the instance we just modified not save
  await user.save({ validateBeforeSave: false });

  //3 Send it back as an email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500 //error that happend in the server
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2) If token has not expired, and there is user, set new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400)); //bad request
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save(); //now we want to validate password

  //3) Update changePasswordAt property for the user
  // user.passwordChangedAt = Date.now();
  //4) Log the user in, send JWT to client
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) Get user from the collection
  const user = await User.findById(req.user.id).select('+password');

  //2) Check if the posted password is correct
  const correct = await user.correctPassword(
    req.body.passwordCurrent,
    user.password
  );
  if (!correct) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  //3) If the password is correct then updtate the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();
  //User.findByIdAndUpdate will NOT word as intended!

  //4) Log use in, send JWT
  createSendToken(user, 200, res);
});
