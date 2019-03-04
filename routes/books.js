/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const { getBooks, Book } = require('../model/books');
const { validate, fkValidate, BuyRecord } = require('../model/buy_records');
const { User } = require('../model/customers');

const router = express.Router();

router.get('/', async (req, res) => {
  const books = await getBooks(req.query);
  res.send(books);
});

router.get('/:id', async (req, res) => {
  const book = await Book.findOne({ _id: req.params.id });
  if (!book) return res.status(400).send('No book with the given id');

  res.send(book);
});

router.post('/:id/add_to_cart', async (req, res) => {
  req.body.book_id = req.params.id;
  let { error } = validate(req.body);
  if (!error) error = await fkValidate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const book = await Book.findOne({ _id: req.body.book_id });
  req.body.cost = req.body.book_hard_cpy === true ? book.hard_price : book.ebook_price;

  const buy = new BuyRecord(req.body);
  const result = await buy.save();

  // validate user && transaction !
  const curUser = await User.findOneAndUpdate({ user_id: req.headers.user_id },
    { $push: { cart: result._id } },
    { new: true });

  res.send({ customer: curUser, request: result });
});

module.exports = router;
