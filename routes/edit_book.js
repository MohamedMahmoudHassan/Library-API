/* eslint-disable consistent-return */
const express = require('express');
// eslint-disable-next-line no-unused-vars
const debug = require('debug')('app:startup');
const { Book, editValidate } = require('../model/books');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('updating book');
});

router.put('/:id', async (req, res) => {
  req.body.id = req.params.id;

  const { error } = editValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const book = await Book.findByIdAndUpdate(req.params.id, { $set: req.body });
  if (!book) return res.status(400).send('No book to update.');

  res.send(book);
});

router.delete('/:id', async (req, res) => {
  req.body.id = req.params.id;

  const { error } = editValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(400).send('No book to delete.');

  res.send(book);
});

module.exports = router;
