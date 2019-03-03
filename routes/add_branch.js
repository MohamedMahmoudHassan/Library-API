const express = require('express');
const { Branch, validate } = require('../model/branches');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Enter branch\'s information');
});

// eslint-disable-next-line consistent-return
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const branch = new Branch(req.body);
  const result = await branch.save();
  res.send(result);
});

module.exports = router;
