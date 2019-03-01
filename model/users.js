const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
// eslint-disable-next-line no-unused-vars
const valDebugger = require('debug')('app:validation');

function validation(body) {
  const Schema = {
    fName: Joi.string().regex(/^[A-Z][a-z]{1,15}$/).required(),
    lName: Joi.string().regex(/^[A-Z][a-z]{1,15}$/).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/^[\w@-]{8,20}$/).required(),
    type: Joi.number().required(),
  };
  return Joi.validate(body, Schema);
}

function loginValidation(body) {
  const Schema = {
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/^[\w@-]{8,20}$/).required(),
  };
  return Joi.validate(body, Schema);
}

function dateAfter(time, days) {
  return time + days * 8640000;
}

const userSchema = new mongoose.Schema({
  fName: { type: String, required: true },
  lName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  type: { type: Number, required: true },
});

// eslint-disable-next-line func-names
userSchema.methods.generateAuthToken = function () {
  // eslint-disable-next-line no-underscore-dangle
  return jwt.sign({ id: this._id, type: this.type, logoutDate: dateAfter(Date.now(), 7) }, config.get('jwtPrivateKey'));
};

const User = mongoose.model('User', userSchema);

module.exports.validate = validation;
module.exports.loginValidation = loginValidation;
module.exports.User = User;
