const express = require('express');

const router = express.Router();

const books = [
  { name: 'Book1', price: 20 },
  { name: 'Book2', price: 100 },
  { name: 'Book3', price: 50 }];


router.get('/:id', (req, res) => {
  res.send(books[req.params.id]);
});

module.exports = router;
