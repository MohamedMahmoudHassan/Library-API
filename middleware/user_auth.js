const decode = require('./decode');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  const decoded = decode(token);
  if (decoded.status === -1) return res.status(400).send('Invalid token.');

  req.user = decoded;
  next();
};
