const winston = require('winston');

module.exports = () => {
  winston.add(new winston.transports.File({ filename: './log_info.log', level: 'info' }));
  winston.add(new winston.transports.File({ filename: './log_err.log', level: 'warn' }));
};
