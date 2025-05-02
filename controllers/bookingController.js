const Tour = require('../models/tourModels');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerFactory');
const AppError = require('../utils/appError');
const axios = require('axios'); // Or use https module

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the current booked tour
  const tour = await Tour.findById(req.params.tourID);

  if (!tour) {
    return next(new AppError('There is no tour with that ID.', 404));
  }

  // 2) Create the checkout session with PayMongo
  try {
    const paymongoSecretKey = process.env.PAYMONGO_SECRET_KEY; // Ensure this is in your .env file

    const sessionData = {
      data: {
        attributes: {
          amount: tour.price * 100, // Amount in centavos
          currency: 'PHP',
          line_items: [
            {
              name: `${tour.name} Tour`,
              quantity: 1,
              amount: tour.price * 100,
              currency: 'PHP',
              description: tour.summary, // Using the tour summary as the description
              images: [`https://natours.dev/img/tours/${tour.imageCover}`], // only possible because same filename in our folder
            },
          ],
          payment_method_types: ['gcash', 'card'], // Enable GCash and Card payments

          success_url: `${req.protocol}://${req.get('host')}/?tour=${
            req.params.tourID
          }&user=${req.user.id}&price=${tour.price}`, // Adjust your success URL

          cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`, // Adjust your cancel URL

          customer_email: req.user.email, // Add the customer's email here
          client_reference_id: `${req.params.tourId}-${
            req.user.id
          }-${Date.now()}`, // Example client reference ID
        },
      },
    };

    const response = await axios.post(
      'https://api.paymongo.com/v1/checkout_sessions',
      sessionData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(paymongoSecretKey + ':').toString(
            'base64'
          )}`,
        },
      }
    );

    const checkoutSession = response.data;

    // 3) Create the session as response
    res.status(200).json({
      status: 'success',
      session: checkoutSession,
    });
  } catch (error) {
    console.error(
      'Error creating PayMongo checkout session:',
      error.response && error.response.data && error.response.data.errors
    );
    return next(new AppError('Could not create checkout session.', 500));
  }
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // THis is only temporary UNSECURE everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
