const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

function validate(body) {
  const Schema = {
    user_id: Joi.objectId().required(),
    branch_id: Joi.objectId().required(),
  };
  return Joi.validate(body, Schema);
}

const Clerk = mongoose.model('Clerk', new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.objectId, ref: 'User', required: true },
  branch_id: { type: mongoose.Schema.Types.objectId, ref: 'Branch', required: true },
}));

module.exports.Clerk = Clerk;
module.exports.validate = validate;
