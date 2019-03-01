/* eslint-disable no-underscore-dangle */
const express = require('express');
const bcrypt = require('bcrypt');
const startupDebugger = require('debug')('app:startup');
const { loginValidation, User } = require('../model/users');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Enter your login data here.');
});

// eslint-disable-next-line consistent-return
router.post('/', async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password');

  const valPassword = await bcrypt.compare(req.body.password, user.password);
  if (!valPassword) return res.status(400).send('Invalid email or password');

  res.header('x-auth-token', user.generateAuthToken()).send(user);
});


module.exports = router;
