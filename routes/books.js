/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const { getBooks, Book } = require('../model/books');
const buy = require('../model/buy_records');
const { User } = require('../model/customers');
const { AvailCopies } = require('../model/available_copies');
const bro = require('../model/borrow_records');
const { isValId, validationErr } = require('../model/functions');

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

router.post('/:id/add_to_cart', async (req, res) => {
  req.body.book_id = req.params.id;
  let { error } = buy.validate(req.body);
  if (!error) error = await buy.fkValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const book = await Book.findOne({ _id: req.body.book_id });
  req.body.cost = req.body.book_hard_cpy === true ? book.hard_price : book.ebook_price;

  const request = new buy.BuyRecord(req.body);
  const result = await request.save();

  // validate user && transaction !
  const curUser = await User.findOneAndUpdate(
    { user_id: req.headers.user_id },
    { $push: { cart: result._id } },
    { new: true },
  );

  res.send({ customer: curUser, request: result });
});

router.get('/:id/availBranches', async (req, res) => {
  let { error } = isValId({ id: req.params.id });
  if (!error) {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) error = validationErr('There is no book with this id.');
    else if (req.query.buy !== 1 && req.query.bro !== 1) {
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


router.post('/:id/borrow_request', async (req, res) => {
  req.body.book_id = req.params.id;
  let { error } = bro.validate(req.body);
  if (!error) error = await bro.fkValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const copy = await AvailCopies.findOneAndUpdate(
    { book_id: req.body.book_id, branch_id: req.body.branch_id },
    { $inc: { avail_bro: -1 } },
    { new: true },
  );

  const request = new bro.BorrowRecord(req.body);
  const result = await request.save();


  const user = await User.findOneAndUpdate(
    { user_id: req.headers.user_id },
    { $push: { bro_list: result._id } },
    { new: true },
  );

  res.send({ copy, result, user });
});

module.exports = router;
