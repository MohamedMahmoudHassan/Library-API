const express = require('express');
const home = require('../routes/home');
const login = require('../routes/login');
const reg = require('../routes/registration');
const books = require('../routes/books');
const profile = require('../routes/profile');
const addBook = require('../routes/add_book');
const editBook = require('../routes/edit_book');
const usersList = require('../routes/users_list');
const addBranch = require('../routes/add_branch');
const addCopies = require('../routes/add_copies');

module.exports = (app) => {
  app.use(express.json());
  app.use('/', home);
  app.use('/home', home);
  app.use('/login', login);
  app.use('/reg', reg);
  app.use('/books_list', books);
  app.use('/profile', profile);
  app.use('/add_book', addBook);
  app.use('/edit_book', editBook);
  app.use('/users_list', usersList);
  app.use('/add_branch', addBranch);
  app.use('/add_copies', addCopies);
};
