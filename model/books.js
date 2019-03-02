const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
// eslint-disable-next-line no-unused-vars
const valDebugger = require('debug')('app:startup');

function validate(body) {
  const Schema = {
    name: Joi.string().min(3).max(20).required(),
    author: Joi.string().min(5).max(20),
    description: Joi.string().min(40).max(200),
    pages_no: Joi.number().required(),
    img_loc: Joi.string(),
    cpy_loc: Joi.string().required(),
    ebook_price: Joi.number().required(),
    hard_price: Joi.number().required(),
  };

  return Joi.validate(body, Schema);
}

function editValidate(body) {
  const Schema = {
    id: Joi.objectId().required(),
    name: Joi.string().min(3).max(20),
    author: Joi.string().min(5).max(20),
    description: Joi.string().min(40).max(200),
    pages_no: Joi.number(),
    img_loc: Joi.string(),
    cpy_loc: Joi.string(),
    ebook_price: Joi.number(),
    hard_price: Joi.number(),
  };

  return Joi.validate(body, Schema);
}

const Book = mongoose.model('Book', new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String },
  des: { type: String },
  pages_no: { type: Number, required: true },
  img_loc: { type: String },
  cpy_loc: { type: String, required: true },
  ebook_price: { type: Number, required: true },
  hard_price: { type: Number, required: true },
}));

// Filtration of books
function qryHandle(query) {
  let sortSplit;
  let sortFilter = {};
  if (query.sort) {
    sortSplit = query.sort.split('_');
    sortFilter[sortSplit[0]] = sortFilter[1] === 'dsc' ? -1 : 1;
  } else {
    sortFilter = { _id: 1 };
  }

  const lim = query.max || 8;
  const page = query.page || 1;

  return {
    find: [
      { name: query.name || /.*.*/ },
      { ebook_price: { $lte: query.eMaxPrice || 100000, $gte: query.eMinPrice || 1 } },
      { hard_price: { $lte: query.hMaxPrice || 100000, $gte: query.hMinPrice || 1 } },
      { pages_no: { $lte: query.maxPages || 100000, $gte: query.minPages || 1 } },
    ],
    sort: sortFilter,
    limit: lim,
    skip: (page - 1) * lim,
  };
}

async function getBooks(query) {
  const filter = qryHandle(query);
  const books = await Book
    .find()
    .and(filter.find)
    .sort(filter.sort)
    .limit(filter.limit)
    .skip(filter.skip);

  return books;
}

module.exports.validate = validate;
module.exports.editValidate = editValidate;
module.exports.Book = Book;
module.exports.getBooks = getBooks;
