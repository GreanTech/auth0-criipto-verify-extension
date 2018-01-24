const path = require('path');
const gulp = require('gulp');
const open = require('open');
const opn = require('opn');
const ngrok = require('ngrok');
const util = require('gulp-util');
const nodemon = require('gulp-nodemon');

gulp.task('run', () => {
  ngrok.connect(3001, (ngrokError, url) => {
    if (ngrokError) {
      throw ngrokError;
    }

    nodemon({
      script: './build/webpack/server.js',
      ext: 'js json',
      cwd: path.join(__dirname, '/../'),
      env: {
        EXTENSION_SECRET: 'mysecret',
        AUTH0_RTA: 'https://auth0.auth0.com',
        NODE_ENV: process.env.NODE_ENV || 'development',
        WT_URL: url,
        PUBLIC_WT_URL: url
      },
      ignore: [
        path.join(__dirname, '../assets/app/'),
        path.join(__dirname, '../client/'),
        path.join(__dirname, '../verify-client/'),
        path.join(__dirname, '../node_modules/'),
        path.join(__dirname, '../tests/')
      ]
    });

    setTimeout(() => {
      const publicUrl = `${url.replace('https://', 'http://')}/admins/login`;
      opn(publicUrl, {app: ['/Applications/Google\ Chrome.app', '--incognito']});
      util.log('Public Url:', publicUrl);
    }, 4000);
  });
});