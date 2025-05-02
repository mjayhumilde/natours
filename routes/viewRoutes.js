const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// render template || npm i pug

router.get(
  '/',
  bookingController.createBookingCheckout, // temporary this is the success url triggered
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);

//boooked toures
router.get('/my-tours', authController.protect, viewsController.getMyTours);

module.exports = router;
