const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Enter your login data here.');
});

module.exports = router;
