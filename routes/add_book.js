const express = require('express');
const { Book, validate } = require('../model/books');
const auth = require('../middleware/clerk_auth');

const router = express.Router();

router.get('/', auth, (req, res) => {
  res.send('Enter book\'s information');
});

// eslint-disable-next-line consistent-return
router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const book = new Book(req.body);
  const result = await book.save();
  res.send(result);
});

module.exports = router;
