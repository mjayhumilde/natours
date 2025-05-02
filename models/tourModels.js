const mongoose = require('mongoose');

const slugify = require('slugify');
// const User = require('./userModels');
// const validator = require('validator');

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a toure must have a name'],
      unique: true,
      maxlength: [40, 'A tour Name must have less or equal 40 characters'],
      minlength: [
        10,
        'A tour Name must have greater than or equal 10 characters',
      ],
      //just demonstrating npm package
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'a tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'a tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is eithier easy, medium, or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'ratingsAverage must be above 0'],
      max: [5, 'ratingsAverage must be below 5'],
      // will round the decimal and make it 1 decimal
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // this only points to current doc on new document creation but not on pacth/update
        validator: function (value) {
          return value < this.price; // 100 < 200 = true || example
        },
        message: 'discount ({VALUE}) should be less than or equal to price',
      },
    },
    summary: {
      type: String,
      trim: true, // cut all the space from start and from the end of strings
      required: [true, 'a tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // special format | GeoJson
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// toursSchema.index({ price: 1 }); //1 or -1 || 1 ascending || -1 descending
toursSchema.index({ price: 1, ratingsAverage: -1 }); // compound Index
toursSchema.index({ slug: 1 });
toursSchema.index({ startLocation: '2dsphere' });

toursSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate
toursSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//DOCUMENT MIDDLWARE MONGOOSE: runs before .save() and .create() | not on update
toursSchema.pre('save', function (next) {
  //access to the document being process of save
  this.slug = slugify(this.name, { lower: true });
  next();
});

///////////////////

//THIS IS EMBEDDING DATA MODEL EXAMPLE
// toursSchema.pre('save', async function (next) {
//   const guidePromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidePromises);

//   next();
// });

//////////////////

// toursSchema.pre('save', function (next) {
//   console.log('Will Save Documents');
//   next();
// });

// toursSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

/// QUERY MIDDLEWARE
// toursSchema.pre('find', function (next) {
toursSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

toursSchema.pre(/^find/, function (next) {
  this.populate({
    // populates fill the ref in model
    path: 'guides',
    select: '-__v -passwordChangedAt', // remove --v and paswordChangedAt
  });
  next();
});

toursSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);

  // console.log(docs);
  next();
});

//AGGREGATION MIDDLEWARE
// toursSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
