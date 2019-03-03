const express = require('express');
const { Branch } = require('../model/branches');

const router = express.Router();

router.get('/', async (req, res) => {
  const branches = await Branch.find();
  res.send(branches);
});

module.exports = router;
