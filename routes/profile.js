/* eslint-disable consistent-return */
const express = require('express');
const { User } = require('../model/customers');
const { BuyRecord } = require('../model/buy_records');
const { isValId } = require('../model/functions');

const router = express.Router();

router.get('/', async (req, res) => {
  const user = await User
    .find({ user_id: req.headers.user_id })
    .populate({ path: 'user_id', select: '-password -_id -__v -type' });
  res.send(user);
});


router.get('/myCart/:id', async (req, res) => {
  if (!isValId(req.params.id)) res.status(400).send(`${req.params.id} is not valid id.`);
  const record = await BuyRecord.find({ _id: req.params.id });
  res.send({ record });
});

router.delete('/deleteFromCart/:id', async (req, res) => {
  if (!isValId(req.params.id)) res.status(400).send(`${req.params.id} is not valid id.`);

  const cart = await User.findOneAndUpdate(
    { user_id: req.headers.user_id },
    { $pull: { cart: req.params.id } },
  );
  if (!cart) return res.status(400).send('No item in your cart with this id.');

  await BuyRecord.findOneAndUpdate({ _id: req.params.id }, {
    $set: { status: -1 },
  });

  res.send(cart);
});


module.exports = router;
