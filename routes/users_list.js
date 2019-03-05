const express = require('express');
const { User } = require('../model/users');
const customers = require('../model/customers');

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.get('/customers', async (req, res) => {
  const customersList = await customers.User.find().populate('user_id');
  res.send(customersList);
});

module.exports = router;
