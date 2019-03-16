const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
// eslint-disable-next-line no-unused-vars
const valDebugger = require('debug')('app:startup');
const { validationErr } = require('./functions');
const { Book } = require('./books');
const { Branch } = require('./branches');

function validate(body) {
  const Schema = {
    book_id: Joi.objectId().required(),
    branch_id: Joi.objectId().required(),
    avail_buy: Joi.number().required().min(0),
    avail_bro: Joi.number().required().min(0),
  };

  return Joi.validate(body, Schema);
}

async function fkValidate(body) {
  const bookExists = await Book.findOne({ _id: body.book_id });
  if (!bookExists) return validationErr('No book with this id.');

  const branchExists = await Branch.findOne({ _id: body.branch_id });
  if (!branchExists) return validationErr('No branch with this id.');
  return undefined;
}

const AvailCopies = mongoose.model('Avail_copies', new mongoose.Schema({
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  avail_buy: { type: Number },
  avail_bro: { type: Number },
  waiting_buy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  waiting_bro: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}));

async function dummyCopy(bookId, branchId) {
  const copy = new AvailCopies({
    book_id: bookId,
    branch_id: branchId,
    avail_bro: 0,
    avail_buy: 0,
  });
  const result = await copy.save();
  return result;
}

async function addCopies(reqCopy, body) {
  const copy = reqCopy || await dummyCopy(body.book_id, body.branch_id);
  copy.avail_bro += body.avail_bro;
  copy.avail_buy += body.avail_buy;

  const result = await copy.save();
  return result;
}

module.exports.AvailCopies = AvailCopies;
module.exports.validate = validate;
module.exports.fkValidate = fkValidate;
module.exports.dummyCopy = dummyCopy;
module.exports.addCopies = addCopies;
