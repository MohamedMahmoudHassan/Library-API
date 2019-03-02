const express = require('express');
const { Book } = require('../model/books');

const router = express.Router();

// eslint-disable-next-line consistent-return
router.get('/:id', async (req, res) => {
  const book = await Book.findOne({ _id: req.params.id });

  if (!book) return res.status(400).send('No book with the given id');

  res.send(book);
});

module.exports = router;
