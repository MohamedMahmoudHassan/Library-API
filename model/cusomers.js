const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

function validate(body) {
  const Schema = {
    user_id: Joi.objectId().required(),
    cart: Joi.array().items(Joi.string()),
    bor_list: Joi.array().items(Joi.string()),
    ebooks_list: Joi.array().items(Joi.string()),
    bought_list: Joi.array().items(Joi.string()),
  };
  return Joi.validate(body, Schema);
}

const Customer = mongoose.model('Customer', new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.objectId, ref: 'User', required: true },
  cart: [{ type: String }],
  bor_list: [{ type: String }],
  ebooks_list: [{ type: String }],
  bought_list: [{ type: String }],
}));

module.exports.Customer = Customer;
module.exports.validate = validate;
