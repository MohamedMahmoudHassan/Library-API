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
    soft_price: Joi.number().required(),
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
  soft_price: { type: Number, required: true },
  hard_price: { type: Number, required: true },
}));

module.exports.validation = validation;
module.exports.Book = Book;
