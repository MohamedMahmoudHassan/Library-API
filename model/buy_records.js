const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { validationErr } = require('./functions');
const { Book } = require('./books');
const { Branch } = require('./branches');
const { AvailCopies } = require('./available_copies');

function validate(body) {
  const Schema = {
    book_id: Joi.objectId().required(),
    branch_id: Joi.objectId(),
    book_hard_cpy: Joi.boolean().required(),
    status: Joi.number().required(),
  };

  return Joi.validate(body, Schema);
}

async function fkValidate(body) {
  const book = await Book.findOne({ _id: body.book_id });
  if (!book) return validationErr('No book with this id.');

  if (body.book_hard_cpy === true) {
    if (!body.branch_id) return validationErr('"branch_id" is required.');

    const branch = await Branch.findOne({ _id: body.branch_id });
    if (!branch) return validationErr('No branch with this id.');

    const availRequest = await AvailCopies.findOne({
      book_id: body.book_id, branch_id: body.branch_id,
    });

    if (!availRequest || !availRequest.avail_buy) return validationErr('This is book is not available in this branch.');
  } else if (body.branch_id) {
    return validationErr('"branch_id" is not allowed');
  }

  return undefined;
}

const BuyRecord = mongoose.model('BuyRecord', new mongoose.Schema({
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  book_hard_cpy: { type: Boolean, required: true },
  branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: this.book_hard_cpy === true },
  status: { type: Number, required: true },
  cost: { type: Number, required: true },
}));

module.exports.validate = validate;
module.exports.fkValidate = fkValidate;
module.exports.BuyRecord = BuyRecord;
