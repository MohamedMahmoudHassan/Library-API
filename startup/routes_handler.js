const home = require('../routes/home');
const login = require('../routes/login');
const reg = require('../routes/registration');
const booksList = require('../routes/books_list');
const book = require('../routes/book');
const profile = require('../routes/profile');

module.exports = (app) => {
  app.use('/', home);
  app.use('/home', home);
  app.use('/login', login);
  app.use('/reg', reg);
  app.use('/books_list', booksList);
  app.use('/book', book);
  app.use('/profile', profile);
};
