const express = require('express');
const { Branch } = require('../model/branches');
const { User } = require('../model/clerks');

const router = express.Router();

router.get('/', async (req, res) => {
  const branches = await Branch.find();
  res.send(branches);
});

router.get('/:id', async (req, res) => {
  const branch = await Branch.findOne({ _id: req.params.id });
  const branchClerks = await User.findOne({ branch_id: req.params.id }).select('user_id -_id');
  res.send({ branch, clerks: branchClerks });
});

module.exports = router;
