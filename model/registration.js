const Joi = require('joi');

function validate(body) {
  const schema = {
    f_name: Joi.string().min(3).max(13).required(),
    l_name: Joi.string().min(3).max(13).required(),
  };
  return Joi.validate(body, schema);
}

module.exports = validate;
