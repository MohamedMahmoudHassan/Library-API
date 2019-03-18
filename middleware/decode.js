const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (token) => {
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    if (decoded.logoutDate <= Date.now()) return { status: -1 };
    return decoded;
  } catch (ex) {
    return { status: -1 };
  }
};
