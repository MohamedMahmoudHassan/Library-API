const express = require('express');
const { getUser } = require('../model/users');

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await getUser(req.query);
  res.send(users);
});

module.exports = router;
