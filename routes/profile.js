/* eslint-disable consistent-return */
const express = require('express');
const { User } = require('../model/customers');
const { BuyRecord, payTotal } = require('../model/buy_records');
const { isValId } = require('../model/functions');

const router = express.Router();

router.get('/', async (req, res) => {
  const user = await User
    .findOne({ user_id: req.headers.user_id })
    .populate({ path: 'user_id', select: '-password -_id -__v -type' });
  res.send(user);
});

router.get('/myCart/pay', async (req, res) => {
  const user = await User.findOne({ user_id: req.headers.user_id });

  const { account, bought, unavailable } = await payTotal(user.cart, req.headers.user_id);

  bought.forEach((book) => {
    if (book.hard_cpy === true) user.bought_list.push(book.id);
    else user.ebooks_list.push(book.id);
  });

  user.cart = unavailable;
  await user.save();

  res.send({ account, unavailable });
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
