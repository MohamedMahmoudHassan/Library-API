const mongoose = require('mongoose');
const Joi = require('joi');

function validation(body) {
  const Schema = {
    name: Joi.string().min(3).max(20).required(),
    author: Joi.string().min(5).max(20),
    description: Joi.string().min(40).max(200),
    pages_no: Joi.number(),
    img_loc: Joi.string(),
    cpy_loc: Joi.string().required(),
    ebook_price: Joi.number().required(),
    hard_price: Joi.number().required(),
  };
  return Joi.validate(body, Schema);
}

const Book = mongoose.model('Book', new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String },
  des: { type: String },
  pages_no: { type: Number },
  img_loc: { type: String },
  cpy_loc: { type: String, required: true },
  ebook_price: { type: Number, required: true },
  hard_price: { type: Number, required: true },
}));

function handleQuery(query) {
  const sortSplit = query.sort.split('_');
  let sortFilter;
  sortFilter[sortSplit[0]] = sortFilter[1] === 'asc' ? 1 : -1;

  const lim = query.max || 8;
  const page = query.page || 1;

  return {
    find: [
      { name: query.name || /.*.*/ },
      { ebook_price: { lte: query.eMaxPrice || 100000, gte: query.eMinPrice || 1 } },
      { hard_price: { lte: query.hMaxPrice || 100000, gte: query.hMinPrice || 1 } },
      { pages_no: { lte: query.maxPages || 100000, gte: query.minPages || 1 } },
    ],
    sort: { sortFilter },
    limit: lim,
    skip: (page - 1) * lim,
  };
}

async function getBooks(query) {
  const filter = handleQuery(query);
  const result = await Book
    .find()
    .and(filter.find)
    .sort(filter.sort)
    .limit(filter.limit)
    .skip(filter.skip);

  return result;
}

module.exports.validation = validation;
module.exports.Book = Book;
module.exports.getBooks = getBooks;
