const Review = require('../models/reviewModel');
const factory = require('../controllers/handlerFactory');

exports.setTourUseIds = (req, res, next) => {
  //ALLOW NESTED ROUTES
  const { tourId } = req.params;
  const user = req.user._id;

  if (!req.body.tour) req.body.tour = tourId;
  if (!req.body.user) req.body.user = user;

  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
