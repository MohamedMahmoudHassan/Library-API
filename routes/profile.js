const express = require('express');
const { User } = require('../model/customers');

const router = express.Router();

router.get('/', async (req, res) => {
  const user = await User
    .find({ user_id: req.headers.user_id })
    .populate({ path: 'user_id', select: '-password -_id -__v -type' });
  res.send(user);
});

module.exports = router;
