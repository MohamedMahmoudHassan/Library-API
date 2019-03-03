const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

function validate(body) {
  const Schema = {
    user_id: Joi.objectId().required(),
  };
  return Joi.validate(body, Schema);
}

const User = mongoose.model('Admin', new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}));

module.exports.User = User;
module.exports.validate = validate;
