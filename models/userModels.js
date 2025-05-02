const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'], //use validate to create a custom validator
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Plase provide a password'],
    minlength: 8,
    //this select in the field will never show in any output in getALlUSERs
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    // this only works on CREATE and SAVE
    validate: {
      //el is the current document
      validator: function (el) {
        return el === this.password; // abc=== abc = true,
      },
      message: 'Password are not the same!',
    },
  },
  passwordChangedAt: { type: Date },
  passwordResetToken: String,
  passwordResetExpires: { type: Date },
  active: {
    type: Boolean,
    default: true,
    select: false, //hide
  },
});

//mogoose middleware
//password encryption
userSchema.pre('save', async function (next) {
  //only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  //npm i bcryptjs
  //hashing algorithm = bcrypt(protect against brute force attacks) cost 18 is cpu intensive(slow)
  //hash is a promise | asynchronous so we need await to not block the event loop
  this.password = await bcrypt.hash(this.password, 12);
  //now we need to delete the confirmpasssword field || we only need confirmpass when creating/save
  //confirm password is required but only on input not on database
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; //sometimes saving have delays
  next();
});

// query middleware = find
/// ^find/ = applied to everyquerry that starts find find
userSchema.pre(/^find/, function (next) {
  // this = point to the current querry
  // get all documents that are active since its all applied to findQuerry
  this.find({ active: { $ne: false } });
  next();
});

//INSTANCE METHOD: available on all documents of a certain collections
//candidate is hash || userpassword is not hass|| we cant use this.password because its hidden here
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//INSTANCE METHOD:
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  //false means the user has not changed password after the token is issued
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimeStamp, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp; //ex 100 < 200
  }
  // false means not changed
  return false;
};

//INSTANCE METHOD: to generate token for forgotPassword
userSchema.methods.createPasswordResetToken = function () {
  //crypto === builtin node modules to generate randomToken || send to user
  //should not be stored in the database | if attacker have access to the database he can have access to reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  //encrypted resetToken
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  // Convert expiration time to Philippine Time (UTC +8)
  const expirationDate = new Date(this.passwordResetExpires);
  const philippinesTime = expirationDate.toLocaleString('en-PH', {
    timeZone: 'Asia/Manila',
  });

  console.log(
    { resetToken },
    this.passwordResetToken,
    'PH TIME: ',
    philippinesTime
  );

  //send to email
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
