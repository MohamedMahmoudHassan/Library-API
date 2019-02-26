const express = require('express');

const router = express.Router();


router.get('/', (req, res) => {
  res.send('Your data is here...Isn\'t ?');
});

module.exports = router;
