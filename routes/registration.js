const express = require('express');
// eslint-disable-next-line no-unused-vars
const dbDebugger = require('debug')('app:db');
const { User, validate } = require('../model/users');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Enter your registration data here.');
});

// eslint-disable-next-line consistent-return
router.post('/', async (req, res) => {
  req.body.type = 0;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = new User(req.body);
  const result = await user.save();
  res.send(result);
});

module.exports = router;
