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
    branch_id: Joi.objectId().required(),
    from: Joi.date().required(),
    to: Joi.date().required(),
    status: Joi.number().required(),
  };

  return Joi.validate(body, Schema);
}

async function fkValidate(body) {
  const book = await Book.findOne({ _id: body.book_id });
  if (!book) return validationErr('No book with this id.');

  const branch = await Branch.findOne({ _id: body.branch_id });
  if (!branch) return validationErr('No branch with this id.');

  const availRequest = await AvailCopies.find({ book_id: body.book_id, branch_id: body.branch_id });
  if (!availRequest) return validationErr('There is no available copies of this book to borrow.');

  return undefined;
}

const BorrowRecord = mongoose.model('BorrowRecords', new mongoose.Schema({
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  status: { type: Number, required: true },
}));

module.exports.validate = validate;
module.exports.fkValidate = fkValidate;
module.exports.BorrowRecord = BorrowRecord;
