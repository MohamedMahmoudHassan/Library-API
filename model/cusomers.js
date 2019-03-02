const mongoose = require('mongoose');
const Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);

const Customer = mongoose.model('Customer', new mongoose.Schema({
  user_id: { type: String, required: true },
  cart: [{ type: String }],
  bor_list: [{ type: String }],
  ebooks_list: [{ type: String }],
  bought_list: [{ type: String }],
}));

module.exports.Customer = Customer;
