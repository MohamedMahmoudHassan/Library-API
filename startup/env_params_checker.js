const config = require('config');
const startupDebugger = require('debug')('app:startup');

module.exports = () => {
  if (!config.get('jwtPrivateKey')) {
    startupDebugger('Fetal error...jwtPrivateKey was not defined');
    process.exit(1);
  }
};
