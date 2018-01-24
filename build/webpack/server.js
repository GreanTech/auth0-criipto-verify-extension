const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const cfgEnv = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';
const config = require('./config.' + cfgEnv + '.js');
const logger = require('../../server/lib/logger');

const options = {
  publicPath: 'http://localhost:3001/app/',
  hot: true,
  inline: true,
  historyApiFallback: true,
  proxy: [
    {
      context: () => true,
      target: {
        port: 3000
      }
    }
  ],

  quiet: false,
  noInfo: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },

  stats: { colors: true },
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
};

new WebpackDevServer(webpack(config), options)
  .listen(3001, 'localhost',
    (err) => {
      if (err) {
        logger.error(err);
      } else {
        logger.info('Webpack proxy listening on: http://localhost:3001');

        // Start the actual webserver.
        require('../../index');
      }
    });
