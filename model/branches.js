const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

function validate(body) {
  const Schema = {
    name: Joi.string().required(),
  };
  return Joi.validate(body, Schema);
}

const Branch = mongoose.model('Branches', new mongoose.Schema({
  name: { type: String, required: true },
}));

module.exports.validate = validate;
module.exports.Branch = Branch;
