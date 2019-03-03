const express = require('express');
const home = require('../routes/home');
const login = require('../routes/login');
const reg = require('../routes/registration');
const profile = require('../routes/profile');
const books = require('../routes/books');
const addBook = require('../routes/add_book');
const editBook = require('../routes/edit_book');
const usersList = require('../routes/users_list');
const addCopies = require('../routes/add_copies');
const branches = require('../routes/branches');
const addBranch = require('../routes/add_branch');

module.exports = (app) => {
  app.use(express.json());
  app.use('/', home);
  app.use('/home', home);
  app.use('/login', login);
  app.use('/reg', reg);
  app.use('/profile', profile);
  app.use('/books', books);
  app.use('/add_book', addBook);
  app.use('/edit_book', editBook);
  app.use('/users_list', usersList);
  app.use('/add_copies', addCopies);
  app.use('/branches', branches);
  app.use('/add_branch', addBranch);
};
