const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

function validate(body) {
  const Schema = {
    user_id: Joi.objectId().required(),
    cart: Joi.array().items(Joi.string()),
    bro_list: Joi.array().items(Joi.string()),
    ebooks_list: Joi.array().items(Joi.string()),
    bought_list: Joi.array().items(Joi.string()),
  };
  return Joi.validate(body, Schema);
}

const User = mongoose.model('Customer', new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BuyRecord' }],
  bro_list: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BroRecord' }],
  ebooks_list: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  bought_list: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  notifications_list: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification' },
}));

module.exports.User = User;
module.exports.validate = validate;
