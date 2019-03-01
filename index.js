const express = require('express');
const startupDebugger = require('debug')('app:startup');
const winston = require('winston');

const app = express();

require('./startup/env_params_checker')();
require('./startup/logging')();
require('./startup/routes_handler')(app);
require('./startup/db')();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  winston.info(`Listening to port ${port}...`);
  startupDebugger(`Listening to port ${port}...`);
});
