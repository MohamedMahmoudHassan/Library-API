const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

function validate(body) {
  const Schema = {
    user_id: Joi.objectId().required(),
  };
  return Joi.validate(body, Schema);
}

const Admin = mongoose.model('Admin', new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.objectId, ref: 'User', required: true },
}));

module.exports.Admin = Admin;
module.exports.validate = validate;
