/* eslint-disable no-await-in-loop */
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
// eslint-disable-next-line no-unused-vars
const valDebugger = require('debug')('app:startup');
const { validationErr } = require('./functions');
const { Book } = require('./books');
const { Branch } = require('./branches');
const { User } = require('./customers');
const { Notification } = require('./notifications');

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

async function notification(bookId, branchId) {
  const newNotification = new Notification({
    message: `Book ${bookId} is now available in branch ${branchId}.`,
    link: 'profile/myCart/pay',
    status: 0,
  });

  const result = await newNotification.save();
  // eslint-disable-next-line no-underscore-dangle
  return result._id;
}

async function addCopies(reqCopy, body) {
  const copy = reqCopy || await dummyCopy(body.book_id, body.branch_id);
  copy.avail_bro += body.avail_bro;
  copy.avail_buy += body.avail_buy;

  if (copy.avail_buy) {
    // eslint-disable-next-line no-restricted-syntax
    for (const userId of copy.waiting_buy) {
      const notificationId = await notification(body.book_id, body.branch_id);
      await User.findOneAndUpdate(
        { user_id: userId },
        { $push: { notifications_list: notificationId } },
      );
    }
    copy.waiting_buy = [];
  }

  if (copy.avail_bro) {
    // eslint-disable-next-line no-restricted-syntax
    for (const userId of copy.waiting_bro) {
      await User.findOneAndUpdate(
        { user_id: userId },
        { $push: { notifications_list: await notification(body.book_id, body.branch_id) } },
      );
    }
    copy.waiting_bro = [];
  }

  const result = await copy.save();
  return result;
}

function waitingListValidate(body) {
  const Schema = {
    book_id: Joi.objectId().required(),
    branch_id: Joi.objectId().required(),
  };
  return Joi.validate(body, Schema);
}

async function addToWaitingList(body) {
  const copy = body.copy || await dummyCopy(body.book_id, body.branch_id);
  if (body.buy === 1) copy.waiting_buy.push(body.user_id);
  if (body.bro === 1) copy.waiting_bro.push(body.user_id);
  await copy.save();
}


module.exports.AvailCopies = AvailCopies;
module.exports.validate = validate;
module.exports.fkValidate = fkValidate;
module.exports.addCopies = addCopies;
module.exports.addToWaitingList = addToWaitingList;
module.exports.waitingListValidate = waitingListValidate;
