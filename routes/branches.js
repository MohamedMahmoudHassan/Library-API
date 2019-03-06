const express = require('express');
const { Branch } = require('../model/branches');
const { User } = require('../model/clerks');
const { AvailCopies } = require('../model/available_copies');
const { isValId } = require('../model/functions');

const router = express.Router();

router.get('/', async (req, res) => {
  const branches = await Branch.find();
  res.send(branches);
});

router.get('/:id', async (req, res) => {
  if (!isValId(req.params.id)) res.status(400).send(`${req.params.id} is not valid id.`);
  const branch = await Branch.findOne({ _id: req.params.id });
  const branchClerks = await User.find({ branch_id: req.params.id }).populate('user_id').select('user_id -_id');
  const branchBooks = await AvailCopies.find({ branch_id: req.params.id }).populate('book_id');
  res.send({ branch, clerks: branchClerks, books: branchBooks });
});

module.exports = router;
