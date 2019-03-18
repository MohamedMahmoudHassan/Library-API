const express = require('express');
const { User } = require('../model/users');
const customers = require('../model/customers');
const auth = require('../middleware/admin_auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.get('/customers', auth, async (req, res) => {
  const customersList = await customers.User.find().populate('user_id');
  res.send(customersList);
});

module.exports = router;
