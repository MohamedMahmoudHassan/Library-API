const express = require('express');
const { Book } = require('../model/books');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const book = await Book.findOne({ _id: req.params.id });
  res.send(book);
});

module.exports = router;
