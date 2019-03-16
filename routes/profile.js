/* eslint-disable consistent-return */
const express = require('express');
const { User } = require('../model/customers');
const { BuyRecord, payTotal } = require('../model/buy_records');
const { isValId } = require('../model/functions');

const router = express.Router();

router.get('/', async (req, res) => {
  const user = await User
    .find({ user_id: req.headers.user_id })
    .populate({ path: 'user_id', select: '-password -_id -__v -type' });
  res.send(user);
});

router.get('/myCart/pay', async (req, res) => {
  const cart = await User.findOne({ user_id: req.headers.user_id });

  const { unavailable, account } = await payTotal(cart.cart, req.headers.user_id);

  cart.cart = unavailable;
  await cart.save();

  res.send({ unavailable, account });
});

router.get('/myCart/:id', async (req, res) => {
  const { error } = isValId({ id: req.params.id });
  if (error) res.status(400).send(error.details[0].message);

  // check if this id belongs to this user.
  const record = await BuyRecord.find({ _id: req.params.id });
  res.send({ record });
});

router.delete('/deleteFromCart/:id', async (req, res) => {
  const { error } = isValId({ id: req.params.id });
  if (error) res.status(400).send(error.details[0].message);

  const cart = await User.findOneAndUpdate(
    { user_id: req.headers.user_id },
    { $pull: { cart: { $in: req.params.id } } },
    { new: true },
  );

  await BuyRecord.findOneAndUpdate({ _id: req.params.id }, {
    $set: { status: -1 },
  });

  res.send(cart);
});


module.exports = router;
