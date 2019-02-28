const express = require('express');
const { getBooks } = require('../model/books');

const router = express.Router();

router.get('/', async (req, res) => {
  const books = await getBooks(req.query);
  res.send(books);
});

module.exports = router;
