const express = require('express');
const home = require('../routes/home');
const login = require('../routes/login');
const reg = require('../routes/registration');
const booksList = require('../routes/books_list');
const book = require('../routes/book');
const profile = require('../routes/profile');
const addBook = require('../routes/add_book');
const editBook = require('../routes/edit_book');
const usersList = require('../routes/users_list');

module.exports = (app) => {
  app.use(express.json());
  app.use('/', home);
  app.use('/home', home);
  app.use('/login', login);
  app.use('/reg', reg);
  app.use('/books_list', booksList);
  app.use('/book', book);
  app.use('/profile', profile);
  app.use('/add_book', addBook);
  app.use('/edit_book', editBook);
  app.use('/users_list', usersList);
};