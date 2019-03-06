const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

function validationErr(msg) {
  return { details: [{ message: msg }] };
}

function valId(body) {
  const Schema = {
    id: Joi.objectId(),
  };
  return Joi.validate(body, Schema);
}

module.exports.validationErr = validationErr;
module.exports.valId = valId;
