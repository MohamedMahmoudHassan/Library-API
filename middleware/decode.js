const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (token) => {
  try {
    return jwt.verify(token, config.get('jwtPrivateKey'));
  } catch (ex) {
    return { status: -1 };
  }
};
