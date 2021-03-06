const express = require('express');
// eslint-disable-next-line no-unused-vars
const dbDebugger = require('debug')('app:db');
const bcrypt = require('bcrypt');
const { User, validate, createUser } = require('../model/users');
const auth = require('../middleware/reg_auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Enter your registration data here.');
});

// eslint-disable-next-line consistent-return
router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const alreadyUser = await User.findOne({ email: req.body.email });
  if (alreadyUser) return res.status(400).send('This email already registered.');

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const result = await createUser(req.body);
  if (result.details) return res.status(400).send(result.details[0].message);

  res.send(result);
});

module.exports = router;
