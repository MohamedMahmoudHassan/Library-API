const winston = require('winston');

module.exports = () => {
  winston.exceptions.handle(
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'log_err.log' }),
  );
  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  winston.add(new winston.transports.File({ filename: './log_info.log', level: 'info' }));
  winston.add(new winston.transports.File({ filename: './log_err.log', level: 'warn' }));
};
