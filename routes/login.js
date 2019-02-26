const express = require('express');
const startupDebugger = require('debug')('app:startup');
const winston = require('winston');
const validate = require('../model/registration');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Enter your login data here.');
});

// eslint-disable-next-line consistent-return
router.post('/', (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    startupDebugger(error);
    winston.warn(error);
    return res.status(400).send(error.details[0].message);
  }
  res.send(`Welcome ${req.body.f_name} ${req.body.l_name}.`);
});

module.exports = router;
