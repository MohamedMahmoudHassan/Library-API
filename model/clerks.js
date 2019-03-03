const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { Branch } = require('./branches');
const { validationErr } = require('./functions');

function validate(body) {
  const Schema = {
    user_id: Joi.objectId().required(),
    branch_id: Joi.objectId().required(),
  };

  return Joi.validate(body, Schema);
}

async function fkValidate(body) {
  const branchExists = await Branch.findOne({ _id: body.branch_id });
  if (!branchExists) return validationErr('No branch with this id.');
  return undefined;
}

const User = mongoose.model('Clerk', new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
}));

module.exports.User = User;
module.exports.validate = validate;
module.exports.fkValidate = fkValidate;
