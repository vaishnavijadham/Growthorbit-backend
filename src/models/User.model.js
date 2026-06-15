'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { USER_ROLES } = require('../constants');

const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },

  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.USER
  },

  isEmailVerified: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  },

  lastLogin: Date,

  refreshToken: {
    type: String,
    select: false
  },

  passwordChangedAt: Date,

  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  }
},
{
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
}
);


// KEEP ONLY THIS INDEX
userSchema.index({
  createdAt: -1
});


// PASSWORD HASH
userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) {
    return next();
  }

  const salt =
    Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

  this.password =
    await bcrypt.hash(this.password, salt);

  if (!this.isNew) {
    this.passwordChangedAt =
      Date.now() - 1000;
  }

  next();

});


// COMPARE PASSWORD
userSchema.methods.comparePassword =
async function (candidatePassword) {

  return bcrypt.compare(
    candidatePassword,
    this.password
  );

};


// JWT CHECK
userSchema.methods.passwordChangedAfter =
function (jwtIssuedAt) {

  if (!this.passwordChangedAt) {
    return false;
  }

  const changed =
    parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

  return jwtIssuedAt < changed;

};


// DISPLAY NAME
userSchema.virtual('displayName')
.get(function () {
  return this.name;
});


module.exports =
mongoose.model(
  'User',
  userSchema
);