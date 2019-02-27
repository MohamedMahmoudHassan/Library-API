const express = require('express');
const startupDebugger = require('debug')('app:startup');
const winston = require('winston');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Enter your login data here.');
});


module.exports = router;
