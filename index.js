const path = require('path');
const nconf = require('nconf');

const logger = require('./server/lib/logger');

// Initialize babel.
require('babel-core/register')({
  ignore: /node_modules/,
  sourceMaps: !(process.env.NODE_ENV === 'production')
});
require('babel-polyfill');

// Handle uncaught.
process.on('uncaughtException', (err) => {
  logger.error(err);
});

// Initialize configuration.
nconf
  .argv()
  .env()
  .file(path.join(__dirname, './server/config.json'))
  .defaults({
    NODE_ENV: process.env.NODE_ENV || 'development',
    HOSTING_ENV: 'default',
    PORT: 3000,
    TITLE: 'Criipto Verify Management'
  });

// Start the server.
const app = require('./server')((key) => nconf.get(key), null);

const port = nconf.get('PORT');
app.listen(port, (error) => {
  if (error) {
    logger.error(error);
  } else {
    logger.info(`Express listening on http://localhost:${port}`);
  }
});
