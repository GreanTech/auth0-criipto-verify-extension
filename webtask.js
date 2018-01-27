const tools = require('auth0-extension-express-tools');

const expressApp = require('./server');

const config = require('./server/lib/config');
const logger = require('./server/lib/logger');

const createServer = tools.createServer((cfg, storage) => {
  logger.info('Starting Criipto Verify Admin Extension - Version:', process.env.CLIENT_VERSION);
  return expressApp(cfg, storage);
});

module.exports = (context, req, res) => {
  console.log("req.webtaskContext", req.webtaskContext);
  var publicWebtaskUrl = tools.urlHelpers.getWebtaskUrl(req);
  if (!publicWebtaskUrl.endsWith('/')) {
    publicWebtaskUrl = publicWebtaskUrl + '/';
  }
  config.setValue('PUBLIC_WT_URL', publicWebtaskUrl);
  createServer(context, req, res);
};
