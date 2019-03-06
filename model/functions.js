const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

function validationErr(msg) {
  return { details: [{ message: msg }] };
}

function isValId(body) {
  const Schema = {
    id: Joi.objectId(),
  };
  return Joi.validate(body, Schema);
}

module.exports.validationErr = validationErr;
module.exports.isValId = isValId;
