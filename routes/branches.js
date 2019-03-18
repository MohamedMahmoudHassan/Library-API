const express = require('express');
const { Branch } = require('../model/branches');
const { User } = require('../model/clerks');
const { AvailCopies } = require('../model/available_copies');
const { isValId } = require('../model/functions');
const auth = require('../middleware/clerk_admin_auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const branches = await Branch.find();
  res.send(branches);
});

router.get('/:id', auth, async (req, res) => {
  const { error } = isValId({ id: req.params.id });
  if (error) res.status(400).send(error.details[0].message);

  const branch = await Branch.findOne({ _id: req.params.id });
  const branchClerks = await User.find({ branch_id: req.params.id }).populate('user_id').select('user_id -_id');
  const branchBooks = await AvailCopies.find({ branch_id: req.params.id }).populate('book_id');
  res.send({ branch, clerks: branchClerks, books: branchBooks });
});

module.exports = router;
