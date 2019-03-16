const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

function validate(body) {
  const Schema = {
    message: Joi.string().required(),
    link: Joi.string().required(),
    status: Joi.boolean(),
  };
  return Joi.validate(body, Schema);
}

const Notification = mongoose.model('Notification', new mongoose.Schema({
  message: { type: String, required: true },
  link: { type: String, required: true },
  status: { type: Boolean, required: true },
}));

module.exports.Notification = Notification;
module.exports.validate = validate;
