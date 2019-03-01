const express = require('express');
// eslint-disable-next-line no-unused-vars
const dbDebugger = require('debug')('app:db');
const bcrypt = require('bcrypt');
const { User, validate } = require('../model/users');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Enter your registration data here.');
});

// eslint-disable-next-line consistent-return
router.post('/', async (req, res) => {
  req.body.type = req.body.type || 1;

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const alreadyUser = await User.findOne({ email: req.body.email });
  if (alreadyUser) return res.status(400).send('This email already registered.');

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const user = new User(req.body);
  const result = await user.save();

  res.send(result);
});

module.exports = router;
