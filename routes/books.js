/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const { getBooks, Book } = require('../model/books');
const buy = require('../model/buy_records');
const { User } = require('../model/customers');
const {
  AvailCopies, waitingListValidate, fkValidate, addToWaitingList,
} = require('../model/available_copies');
const bro = require('../model/borrow_records');
const { isValId, validationErr } = require('../model/functions');
const customerAuth = require('../middleware/customer_auth');
const userAuth = require('../middleware/user_auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const books = await getBooks(req.query);
  res.send(books);
});

router.get('/:id', async (req, res) => {
  const { error } = isValId({ id: req.params.id });
  if (error) res.status(400).send(error.details[0].message);

  const book = await Book.findOne({ _id: req.params.id });
  if (!book) return res.status(400).send('No book with the given id');

  res.send(book);
});

router.post('/:id/add_to_cart', customerAuth, async (req, res) => {
  req.body.book_id = req.params.id;
  const { error } = buy.validate(req.body) || await buy.fkValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ user_id: req.user.id });
  if (!req.body.book_hard_cpy) {
    const alreadyHave = user.ebooks_list.find(book => req.body.book_id === `${book}`);
    if (alreadyHave) return res.status(400).send('You already bought this book.');

    // eslint-disable-next-line no-restricted-syntax
    for (const recordId of user.cart) {
      // eslint-disable-next-line no-await-in-loop
      const record = await buy.BuyRecord.findOne({ _id: recordId });
      if (!record.book_hard_cpy && req.body.book_id === `${record.book_id}`) return res.status(400).send('This book is already in your cart.');
    }
  }

  const book = await Book.findOne({ _id: req.body.book_id });
  req.body.cost = req.body.book_hard_cpy === true ? book.hard_price : book.ebook_price;

  const request = new buy.BuyRecord(req.body);
  const result = await request.save();

  // validate user && transaction !
  user.cart.push(result._id);
  await user.save();

  res.send({ customer: user, request: result });
});

router.get('/:id/availBranches', userAuth, async (req, res) => {
  let { error } = isValId({ id: req.params.id });
  if (!error) {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) error = validationErr('There is no book with this id.');
    else if (req.query.buy !== '1' && req.query.bro !== '1') {
      error = validationErr('You need to choose what is available borrow/buy.');
    }
  }
  if (error) return res.status(400).send(error.details[0].message);

  const result = await AvailCopies.find({
    book_id: req.params.id,
    avail_buy: { $gte: req.query.buy === 1 },
    avail_bro: { $gte: req.query.bro === 1 },
  }).select('_id');

  res.send(result);
});

router.post('/:id/add_to_waitingList', customerAuth, async (req, res) => {
  req.body.book_id = req.params.id;
  let { error } = waitingListValidate(req.body) || await fkValidate(req.body);
  if (!error && req.query.buy !== '1' && req.query.bro !== '1') error = validationErr('You need to choose waiting list buy/bro.');
  if (error) return res.status(400).send(error.details[0].message);

  req.body.copy = await AvailCopies.findOne(
    { book_id: req.body.book_id, branch_id: req.body.branch_id },
  );

  if (req.body.copy.avail_buy > 0 && req.query.buy === '1') return res.status(400).send('There is available copies from this book to buy from this branch.');
  if (req.body.copy.avail_bro > 0 && req.query.bro === '1') return res.status(400).send('There is available copies from this book to borrow from this branch.');

  req.body.user_id = req.user.id;

  await addToWaitingList(req.body);
  res.send('You will be notified when this book is available.');
});

router.post('/:id/borrow_request', customerAuth, async (req, res) => {
  req.body.book_id = req.params.id;
  const { error } = bro.validate(req.body) || await bro.fkValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const copy = await AvailCopies.findOneAndUpdate(
    { book_id: req.body.book_id, branch_id: req.body.branch_id },
    { $inc: { avail_bro: -1 } },
    { new: true },
  );

  const request = new bro.BorrowRecord(req.body);
  const result = await request.save();


  const user = await User.findOneAndUpdate(
    { user_id: req.user.id },
    { $push: { bro_list: result._id } },
    { new: true },
  );

  res.send({ copy, result, user });
});

module.exports = router;
