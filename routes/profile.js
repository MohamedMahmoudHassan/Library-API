const express = require('express');
const { User } = require('../model/customers');
const { BuyRecord } = require('../model/buy_records');

const router = express.Router();

router.get('/', async (req, res) => {
  const user = await User
    .find({ user_id: req.headers.user_id })
    .populate({ path: 'user_id', select: '-password -_id -__v -type' });
  res.send(user);
});

router.get('/myCart/:id', async (req, res) => {
  const record = await BuyRecord.find({ _id: req.params.id });
  res.send(record);
});


module.exports = router;
